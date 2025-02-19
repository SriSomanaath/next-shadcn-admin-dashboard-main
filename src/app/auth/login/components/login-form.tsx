"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react"; // Import NextAuth's signIn function
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  rememberMe: z.boolean(),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    // Remember me logic: store email in localStorage if checked.
    if (data.rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("email", data.email);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("email");
    }

    // Use NextAuth's signIn method with the credentials provider.
    const res = await signIn("credentials", {
      redirect: false, // We handle redirection manually.
      username: data.email, // NextAuth expects a field named 'username'.
      password: data.password,
      callbackUrl: "/dashboard", // Redirect URL after successful login.
    });

    if (res?.error) {
      toast({
        title: "Login failed",
        description: res.error,
      });
      setIsLoading(false);
      return;
    }

    if (res?.ok && res.url) {
      // Redirect to the callbackUrl (/dashboard)
      window.location.href = res.url;
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Password Field with Eye Icon */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...field}
                  className="pr-10" // Extra padding to accommodate the icon
                />
              </FormControl>
              {/* Toggle Icon */}
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500 mt-5" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500 mt-5" />
                )}
              </div>
              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Remember Me Checkbox */}
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel>Remember me</FormLabel>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button disabled={isLoading} className="w-full">
          {isLoading && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login
        </Button>
      </form>
    </Form>
  );
}
