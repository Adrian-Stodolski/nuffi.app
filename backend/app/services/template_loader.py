import json
import os
from pathlib import Path
from typing import List, Dict, Optional
from sqlalchemy.orm import Session

from ..models.workspace import WorkspaceTemplate
from ..database import SessionLocal

class TemplateLoader:
    def __init__(self):
        self.templates_dir = Path(__file__).parent.parent / "tools" / "templates"
    
    def load_template_from_file(self, template_file: Path) -> Optional[Dict]:
        """Load template from JSON file"""
        try:
            with open(template_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading template {template_file}: {e}")
            return None
    
    def load_all_templates(self) -> List[Dict]:
        """Load all template files"""
        templates = []
        
        if self.templates_dir.exists():
            for template_file in self.templates_dir.glob("*.json"):
                template_data = self.load_template_from_file(template_file)
                if template_data:
                    templates.append(template_data)
        
        return templates
    
    def seed_database_templates(self, db: Session = None):
        """Seed database with template files"""
        if db is None:
            db = SessionLocal()
        
        try:
            templates = self.load_all_templates()
            
            for template_data in templates:
                # Check if template already exists
                existing = db.query(WorkspaceTemplate).filter(
                    WorkspaceTemplate.slug == template_data.get('slug')
                ).first()
                
                if existing:
                    print(f"Template {template_data.get('name')} already exists, skipping...")
                    continue
                
                # Create new template
                template = WorkspaceTemplate(
                    name=template_data.get('name'),
                    slug=template_data.get('slug'),
                    category=template_data.get('category'),
                    description=template_data.get('description'),
                    long_description=template_data.get('long_description'),
                    thumbnail_url=template_data.get('thumbnail_url'),
                    author_type=template_data.get('author_type', 'official'),
                    gui_tools=template_data.get('gui_tools', []),
                    cli_tools=template_data.get('cli_tools', []),
                    packages=template_data.get('packages', {}),
                    dotfiles=template_data.get('dotfiles', []),
                    settings=template_data.get('settings', {}),
                    extensions=template_data.get('extensions', []),
                    starter_projects=template_data.get('starter_projects', []),
                    readme=template_data.get('readme'),
                    tutorials=template_data.get('tutorials', []),
                    requirements=template_data.get('requirements', {}),
                    downloads=template_data.get('downloads', 0),
                    stars=template_data.get('stars', 0),
                    rating_average=template_data.get('rating_average', 0),
                    rating_count=template_data.get('rating_count', 0),
                    tags=template_data.get('tags', []),
                    is_official=template_data.get('is_official', False),
                    is_premium=template_data.get('is_premium', False),
                    is_public=template_data.get('is_public', True)
                )
                
                db.add(template)
                print(f"Added template: {template_data.get('name')}")
            
            db.commit()
            print(f"Successfully seeded {len(templates)} templates")
            
        except Exception as e:
            print(f"Error seeding templates: {e}")
            db.rollback()
        finally:
            if db:
                db.close()
    
    def update_template_in_database(self, template_slug: str, db: Session = None):
        """Update existing template from file"""
        if db is None:
            db = SessionLocal()
        
        try:
            # Find template file
            template_file = self.templates_dir / f"{template_slug}.json"
            if not template_file.exists():
                print(f"Template file {template_slug}.json not found")
                return False
            
            # Load template data
            template_data = self.load_template_from_file(template_file)
            if not template_data:
                return False
            
            # Find existing template in database
            existing = db.query(WorkspaceTemplate).filter(
                WorkspaceTemplate.slug == template_slug
            ).first()
            
            if not existing:
                print(f"Template {template_slug} not found in database")
                return False
            
            # Update template fields
            existing.name = template_data.get('name', existing.name)
            existing.description = template_data.get('description', existing.description)
            existing.long_description = template_data.get('long_description', existing.long_description)
            existing.gui_tools = template_data.get('gui_tools', existing.gui_tools)
            existing.cli_tools = template_data.get('cli_tools', existing.cli_tools)
            existing.packages = template_data.get('packages', existing.packages)
            existing.dotfiles = template_data.get('dotfiles', existing.dotfiles)
            existing.settings = template_data.get('settings', existing.settings)
            existing.requirements = template_data.get('requirements', existing.requirements)
            
            db.commit()
            print(f"Updated template: {template_data.get('name')}")
            return True
            
        except Exception as e:
            print(f"Error updating template: {e}")
            db.rollback()
            return False
        finally:
            if db:
                db.close()

# CLI command to seed templates
if __name__ == "__main__":
    loader = TemplateLoader()
    loader.seed_database_templates()