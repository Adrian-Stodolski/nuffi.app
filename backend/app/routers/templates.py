from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..models.workspace import WorkspaceTemplate

router = APIRouter()

class TemplateResponse(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    description: str
    long_description: Optional[str]
    thumbnail_url: Optional[str]
    gui_tools: List[str]
    cli_tools: List[str]
    packages: dict
    dotfiles: List[dict]
    setup_time: str
    difficulty: str
    downloads: int
    rating_average: float
    rating_count: int
    tags: List[str]
    is_official: bool
    is_premium: bool
    requirements: dict
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[TemplateResponse])
async def get_templates(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in name/description"),
    is_official: Optional[bool] = Query(None, description="Show only official templates"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get workspace templates with optional filtering"""
    
    query = db.query(WorkspaceTemplate).filter(WorkspaceTemplate.is_public == True)
    
    if category:
        query = query.filter(WorkspaceTemplate.category == category)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            WorkspaceTemplate.name.ilike(search_term) |
            WorkspaceTemplate.description.ilike(search_term)
        )
    
    if is_official is not None:
        query = query.filter(WorkspaceTemplate.is_official == is_official)
    
    if difficulty:
        # Difficulty is stored in requirements JSON
        query = query.filter(WorkspaceTemplate.requirements['difficulty'].astext == difficulty)
    
    templates = query.order_by(WorkspaceTemplate.downloads.desc()).offset(offset).limit(limit).all()
    
    # Convert to response format
    result = []
    for template in templates:
        template_dict = {
            "id": str(template.id),
            "name": template.name,
            "slug": template.slug,
            "category": template.category,
            "description": template.description,
            "long_description": template.long_description,
            "thumbnail_url": template.thumbnail_url,
            "gui_tools": template.gui_tools or [],
            "cli_tools": template.cli_tools or [],
            "packages": template.packages or {},
            "dotfiles": template.dotfiles or [],
            "setup_time": template.requirements.get('setup_time', '15-20 min') if template.requirements else '15-20 min',
            "difficulty": template.requirements.get('difficulty', 'Intermediate') if template.requirements else 'Intermediate',
            "downloads": template.downloads,
            "rating_average": template.rating_average,
            "rating_count": template.rating_count,
            "tags": template.tags or [],
            "is_official": template.is_official,
            "is_premium": template.is_premium,
            "requirements": template.requirements or {},
            "created_at": template.created_at
        }
        result.append(template_dict)
    
    return result

@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: str, db: Session = Depends(get_db)):
    """Get detailed information about a specific template"""
    
    template = db.query(WorkspaceTemplate).filter(
        WorkspaceTemplate.id == template_id,
        WorkspaceTemplate.is_public == True
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Increment download count (view count)
    template.downloads += 1
    db.commit()
    
    return {
        "id": str(template.id),
        "name": template.name,
        "slug": template.slug,
        "category": template.category,
        "description": template.description,
        "long_description": template.long_description,
        "thumbnail_url": template.thumbnail_url,
        "gui_tools": template.gui_tools or [],
        "cli_tools": template.cli_tools or [],
        "packages": template.packages or {},
        "dotfiles": template.dotfiles or [],
        "setup_time": template.requirements.get('setup_time', '15-20 min') if template.requirements else '15-20 min',
        "difficulty": template.requirements.get('difficulty', 'Intermediate') if template.requirements else 'Intermediate',
        "downloads": template.downloads,
        "rating_average": template.rating_average,
        "rating_count": template.rating_count,
        "tags": template.tags or [],
        "is_official": template.is_official,
        "is_premium": template.is_premium,
        "requirements": template.requirements or {},
        "created_at": template.created_at
    }

@router.get("/categories/list")
async def get_categories(db: Session = Depends(get_db)):
    """Get all available template categories"""
    
    categories = db.query(WorkspaceTemplate.category).distinct().all()
    category_list = [cat[0] for cat in categories]
    
    return {
        "categories": category_list,
        "total": len(category_list)
    }

@router.get("/popular/list")
async def get_popular_templates(
    limit: int = Query(10, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get most popular templates"""
    
    templates = db.query(WorkspaceTemplate).filter(
        WorkspaceTemplate.is_public == True
    ).order_by(
        WorkspaceTemplate.downloads.desc(),
        WorkspaceTemplate.rating_average.desc()
    ).limit(limit).all()
    
    result = []
    for template in templates:
        result.append({
            "id": str(template.id),
            "name": template.name,
            "category": template.category,
            "downloads": template.downloads,
            "rating_average": template.rating_average,
            "thumbnail_url": template.thumbnail_url
        })
    
    return {"templates": result}

@router.post("/{template_id}/rate")
async def rate_template(
    template_id: str,
    rating: int = Query(..., ge=1, le=5),
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    """Rate a template (1-5 stars)"""
    
    template = db.query(WorkspaceTemplate).filter(
        WorkspaceTemplate.id == template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # In a real app, you'd check if user already rated and store individual ratings
    # For now, we'll just update the average
    current_total = template.rating_average * template.rating_count
    new_count = template.rating_count + 1
    new_average = (current_total + rating) / new_count
    
    template.rating_average = round(new_average, 1)
    template.rating_count = new_count
    
    db.commit()
    
    return {
        "message": "Rating submitted successfully",
        "new_average": template.rating_average,
        "total_ratings": template.rating_count
    }