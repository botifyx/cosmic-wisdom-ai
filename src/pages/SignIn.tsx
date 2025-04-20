
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  rememberMe: z.boolean().optional(),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log('Sign in data:', data);
    // In a real app, this would make an API call to authenticate the user
    
    toast.success('Successfully signed in!', {
      description: 'Welcome back to TAINTRA',
    });
    
    // Redirect to home page after successful login
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-cosmic-midnight text-white pb-12 bg-[url('https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=3880&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-cosmic-midnight/70 backdrop-blur-sm"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="pt-20 px-4">
          <Link to="/">
            <Button variant="ghost" className="text-cosmic-gold hover:text-cosmic-gold/80 hover:bg-cosmic-deep-purple/30">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
        
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md bg-cosmic-deep-purple/40 backdrop-blur-md p-8 rounded-lg border-cosmic-gold/30">
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <span className="text-3xl font-bold text-cosmic-gold text-glow">TAINTRA</span>
              </div>
              <h2 className="text-2xl font-serif mt-2 mb-1 text-cosmic-gold">Sign In</h2>
              <p className="text-gray-300 text-sm">
                Enter your cosmic journey through ancient wisdom
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cosmic-gold">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-10 bg-cosmic-deep-purple/20 border-cosmic-gold/30 focus:border-cosmic-gold"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cosmic-gold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••" 
                            className="pl-10 bg-cosmic-deep-purple/20 border-cosmic-gold/30 focus:border-cosmic-gold" 
                            {...field} 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="rememberMe"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-cosmic-gold/50 data-[state=checked]:bg-cosmic-gold data-[state=checked]:text-cosmic-midnight"
                        />
                        <label 
                          htmlFor="rememberMe"
                          className="text-sm text-gray-300 cursor-pointer select-none"
                        >
                          Remember me
                        </label>
                      </div>
                    )}
                  />
                  
                  <Link 
                    to="#" 
                    className="text-sm text-cosmic-gold hover:text-cosmic-gold/80 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full cosmic-button bg-gradient-to-r from-cosmic-deep-purple to-cosmic-bright-purple hover:opacity-90"
                >
                  Sign In
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-cosmic-gold hover:text-cosmic-gold/80 underline-offset-4 hover:underline"
                >
                  Create Account
                </Link>
              </p>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cosmic-gold/30"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-cosmic-deep-purple/40 text-gray-400">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-3 justify-center">
                  <Button variant="outline" className="border-cosmic-gold/30 hover:bg-cosmic-deep-purple/30">
                    Google
                  </Button>
                  <Button variant="outline" className="border-cosmic-gold/30 hover:bg-cosmic-deep-purple/30">
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
