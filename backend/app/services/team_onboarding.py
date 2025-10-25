import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from ..models.company import Company, TeamWorkspaceTemplate, Profile
from ..models.workspace import WorkspaceTemplate

class TeamOnboardingService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_onboarding_invitation(
        self, 
        company_id: str, 
        employee_email: str, 
        employee_name: str, 
        role: str
    ) -> Dict:
        """Create an onboarding invitation for a new employee"""
        
        # Verify company exists
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise ValueError("Company not found")
        
        # Get team template for role
        team_template = self.db.query(TeamWorkspaceTemplate).filter(
            TeamWorkspaceTemplate.company_id == company_id,
            TeamWorkspaceTemplate.role == role
        ).first()
        
        if not team_template:
            raise ValueError(f"No template found for role: {role}")
        
        # Generate secure token
        token = secrets.token_urlsafe(32)
        
        # In production, store invitation in database
        invitation_data = {
            "token": token,
            "company_id": company_id,
            "employee_email": employee_email,
            "employee_name": employee_name,
            "role": role,
            "team_template_id": str(team_template.id),
            "expires_at": datetime.utcnow() + timedelta(days=7),
            "created_at": datetime.utcnow()
        }
        
        # Generate invitation URL
        invite_url = f"https://nuffi.app/onboard/{token}"
        
        return {
            "invitation": invitation_data,
            "invite_url": invite_url,
            "expires_in_days": 7
        }
    
    def send_onboarding_email(
        self, 
        employee_email: str, 
        employee_name: str, 
        company_name: str, 
        role: str, 
        invite_url: str
    ) -> bool:
        """Send onboarding email to new employee"""
        
        try:
            # Email configuration (in production, use environment variables)
            smtp_server = "smtp.gmail.com"  # Replace with your SMTP server
            smtp_port = 587
            sender_email = "noreply@nuffi.app"  # Replace with your email
            sender_password = "your_password"  # Replace with your password
            
            # Create email content
            subject = f"Welcome to {company_name}! 🎉 Your Development Environment Awaits"
            
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0f0f14; color: #ffffff; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ text-align: center; padding: 40px 0; background: linear-gradient(135deg, #00bfff, #8b5cf6); border-radius: 16px; margin-bottom: 30px; }}
                    .logo {{ font-size: 32px; font-weight: bold; margin-bottom: 10px; }}
                    .welcome-text {{ font-size: 18px; opacity: 0.9; }}
                    .content {{ background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px; margin-bottom: 20px; }}
                    .cta-button {{ display: inline-block; background: linear-gradient(135deg, #00bfff, #8b5cf6); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; margin: 20px 0; }}
                    .workspace-info {{ background: rgba(0, 191, 255, 0.1); border: 1px solid rgba(0, 191, 255, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0; }}
                    .footer {{ text-align: center; padding: 20px; color: #888; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">👻 NUFFI</div>
                        <div class="welcome-text">Welcome to {company_name}!</div>
                    </div>
                    
                    <div class="content">
                        <h2>Hi {employee_name}! 👋</h2>
                        
                        <p>Welcome to the team! We're excited to have you join us as a <strong>{role}</strong>.</p>
                        
                        <p>To get your development environment set up quickly and efficiently, we've prepared a custom workspace just for you. With Nuffi, you'll have everything you need installed and configured in just 15 minutes!</p>
                        
                        <div class="workspace-info">
                            <h3>🚀 Your {role} Workspace Includes:</h3>
                            <ul>
                                <li>✅ All necessary development tools and IDEs</li>
                                <li>✅ Company-specific configurations and dotfiles</li>
                                <li>✅ Access to internal tools and repositories</li>
                                <li>✅ Pre-configured development environment</li>
                                <li>✅ Starter projects and documentation</li>
                            </ul>
                        </div>
                        
                        <h3>🎯 Getting Started (3 Simple Steps):</h3>
                        <ol>
                            <li><strong>Click the button below</strong> to access your onboarding portal</li>
                            <li><strong>Download Nuffi</strong> (takes 2 minutes)</li>
                            <li><strong>Install your workspace</strong> (takes 15 minutes)</li>
                        </ol>
                        
                        <div style="text-align: center;">
                            <a href="{invite_url}" class="cta-button">🚀 Set Up My Workspace</a>
                        </div>
                        
                        <p><strong>Important:</strong> This invitation link expires in 7 days, so please complete your setup soon!</p>
                        
                        <p>If you have any questions, don't hesitate to reach out to your team lead or IT support.</p>
                        
                        <p>Welcome aboard! 🎉</p>
                        
                        <p>Best regards,<br>
                        The {company_name} Team</p>
                    </div>
                    
                    <div class="footer">
                        <p>This email was sent by Nuffi - AI-Powered Development Environment</p>
                        <p>If you didn't expect this email, please contact your company's IT department.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = sender_email
            message["To"] = employee_email
            
            # Add HTML content
            html_part = MIMEText(html_body, "html")
            message.attach(html_part)
            
            # Send email (commented out for demo - uncomment in production)
            # with smtplib.SMTP(smtp_server, smtp_port) as server:
            #     server.starttls()
            #     server.login(sender_email, sender_password)
            #     server.sendmail(sender_email, employee_email, message.as_string())
            
            print(f"Email would be sent to {employee_email}")  # Demo log
            return True
            
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def validate_invitation_token(self, token: str) -> Optional[Dict]:
        """Validate invitation token and return invitation data"""
        
        # In production, look up token in database
        # For demo, we'll return mock data for valid-looking tokens
        if len(token) >= 20:
            return {
                "company_name": "Acme Corp",
                "employee_name": "New Employee",
                "role": "Frontend Developer",
                "team_template_id": "template_123",
                "expires_at": datetime.utcnow() + timedelta(days=7)
            }
        
        return None
    
    def create_user_from_invitation(self, invitation_data: Dict, user_details: Dict) -> Dict:
        """Create user account from invitation"""
        
        # In production, create actual user account
        user_data = {
            "id": secrets.token_hex(16),
            "email": invitation_data.get("employee_email"),
            "full_name": invitation_data.get("employee_name"),
            "company_id": invitation_data.get("company_id"),
            "role": invitation_data.get("role"),
            "created_at": datetime.utcnow()
        }
        
        return user_data
    
    def merge_team_template_with_base(self, team_template_id: str) -> Dict:
        """Merge team template customizations with base template"""
        
        team_template = self.db.query(TeamWorkspaceTemplate).filter(
            TeamWorkspaceTemplate.id == team_template_id
        ).first()
        
        if not team_template:
            raise ValueError("Team template not found")
        
        base_template = team_template.template
        
        # Merge configurations
        merged_config = {
            "id": str(base_template.id),
            "name": f"{team_template.company.name} - {team_template.role}",
            "category": base_template.category,
            "description": base_template.description,
            "gui_tools": (base_template.gui_tools or []) + (team_template.custom_tools or []),
            "cli_tools": base_template.cli_tools or [],
            "packages": {**(base_template.packages or {}), **(team_template.custom_packages or {})},
            "dotfiles": (base_template.dotfiles or []) + (team_template.custom_dotfiles or []),
            "settings": {**(base_template.settings or {}), **(team_template.custom_settings or {})},
            "company_config": {
                "github_org": team_template.github_org,
                "slack_workspace": team_template.slack_workspace,
                "vpn_config": team_template.vpn_config,
                "onboarding_guide": team_template.onboarding_guide,
                "internal_wiki": team_template.internal_wiki
            }
        }
        
        return merged_config
    
    def get_company_onboarding_stats(self, company_id: str) -> Dict:
        """Get onboarding statistics for a company"""
        
        # In production, query actual invitation and workspace data
        return {
            "total_invitations_sent": 25,
            "completed_onboardings": 23,
            "pending_onboardings": 2,
            "average_setup_time_minutes": 16.5,
            "success_rate": 92.0,
            "most_popular_role": "Frontend Developer"
        }