
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/services/authService';
import { toast } from 'sonner';

interface ProfileSectionProps {
  onBack: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onBack }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mb-6" 
          onClick={onBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <div className="space-y-8">
          <div className="text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary">
                {currentUser?.displayName 
                  ? currentUser.displayName.charAt(0).toUpperCase() 
                  : currentUser?.email?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <h2 className="text-2xl font-bold">
              {currentUser?.displayName || 'User'}
            </h2>
            <p className="text-muted-foreground">{currentUser?.email}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account</h3>
            
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
