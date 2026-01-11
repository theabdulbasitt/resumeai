import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignInPage = () => {
    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-display font-bold text-2xl text-foreground">ResumeAI</span>
                </Link>

                {/* Clerk SignIn Component */}
                <div className="flex flex-col items-center">
                    <SignIn
                        routing="path"
                        path="/login"
                        signUpUrl="/signup"
                        afterSignInUrl="/builder"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-card border border-border shadow-xl rounded-2xl",
                                headerTitle: "font-display text-foreground",
                                headerSubtitle: "text-muted-foreground",
                                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                                footerActionLink: "text-primary hover:underline",
                                identityPreviewBlock: "bg-accent/50 border-border",
                                formFieldInput: "bg-background border-border",
                                socialButtonsBlockButton: "border-border hover:bg-accent transition-colors",
                                developmentBadge: "hidden"
                            }
                        }}
                    />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-medium hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Skip for now */}
                <div className="mt-6 text-center">
                    <Link
                        to="/builder"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Continue without signing in →
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignInPage;
