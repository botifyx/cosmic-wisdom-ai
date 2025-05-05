
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  birthDate: z.date({
    required_error: "Birth date is required.",
  }),
  birthTime: z.string().min(1, {
    message: "Birth time is required.",
  }),
  birthPlace: z.string().min(2, {
    message: "Birth place is required.",
  }),
});

export function JanamKundaliForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      birthTime: "",
      birthPlace: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call to generate kundali
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Store the form data in sessionStorage for the results page
      sessionStorage.setItem('kundaliData', JSON.stringify({
        ...values,
        birthDate: format(values.birthDate, 'dd-MM-yyyy'),
      }));
      
      toast({
        title: "Janam Kundali Generated",
        description: "Your cosmic birth chart is ready to view",
      });
      
      // Navigate to the result page
      navigate('/astrology/janam-kundali-result');
    }, 3000);
  }

  return (
    <div className="cosmic-card p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-cosmic-gold">
        Generate Your Janam Kundali
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    className="cosmic-input" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Your name influences how cosmic energies interact with you.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-white">Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "cosmic-input w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto bg-cosmic-deep-purple/90"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-gray-400">
                  Your birth date determines your zodiac sign and planetary positions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Time of Birth</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="time"
                      className="cosmic-input w-full" 
                      {...field} 
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </FormControl>
                <FormDescription className="text-gray-400">
                  Birth time is crucial for calculating your ascendant and house placements.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthPlace"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Place of Birth</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="City, Country" 
                      className="cosmic-input w-full" 
                      {...field} 
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </FormControl>
                <FormDescription className="text-gray-400">
                  Birth location affects the calculation of planetary positions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="cosmic-button w-full h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Consulting the Vedic Stars...
              </>
            ) : (
              "Generate Janam Kundali"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
