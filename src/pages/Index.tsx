import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageClassifier } from '@/components/ai/ImageClassifier';
import { SentimentAnalyzer } from '@/components/ai/SentimentAnalyzer';
import { TextSummarizer } from '@/components/ai/TextSummarizer';
import { Brain, Sparkles, Zap, Github } from 'lucide-react';

const Index = () => {
  const demosRef = useRef<HTMLDivElement>(null);

  const scrollToDemos = () => {
    demosRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Showcase
              </span>
            </div>
        <div className="flex items-center gap-4">
  <Badge variant="outline" className="hidden sm:inline-flex">
    yadavsharn
  </Badge>
  <a
    href="https://github.com/yadavsharn"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button variant="outline" size="sm">
      <Github className="w-4 h-4" />
    </Button>
  </a>
</div>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <Badge variant="secondary">Try AI in Your Browser</Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Experience AI
              <br />
              <span className="text-foreground">in Action</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover the power of artificial intelligence with our interactive demos. 
              Upload images, analyze text sentiment, and create summaries—all running 
              directly in your browser with cutting-edge AI models.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button variant="hero" size="lg" className="group" onClick={scrollToDemos}>
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Try the Demos Below
              </Button>
              <Button variant="outline" size="lg">
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demos Section */}
      <section ref={demosRef} className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Interactive AI Demos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each demo runs entirely in your browser using WebAssembly and WebGPU 
              for maximum privacy and performance.
            </p>
          </div>

          <div className="grid lg:grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Image Classifier */}
            <div className="xl:col-span-2">
              <ImageClassifier />
            </div>

            {/* Sentiment Analyzer and Text Summarizer */}
            <div className="space-y-8 xl:space-y-0">
              <SentimentAnalyzer />
            </div>
            <div className="space-y-8 xl:space-y-0">
              <TextSummarizer />
            </div>
          </div>
        </div>
      </section>

      {/* How AI Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              How Does AI Work?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Neural Networks</h3>
                <p className="text-muted-foreground">
                  AI models are like digital brains with millions of connections that 
                  learn patterns from data, similar to how humans learn from experience.
                </p>
              </div>
              <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Training Process</h3>
                <p className="text-muted-foreground">
                  These models are trained on massive datasets—millions of images, 
                  texts, and examples—to recognize patterns and make predictions.
                </p>
              </div>
              <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Inference</h3>
                <p className="text-muted-foreground">
                  Once trained, these models can analyze new data instantly, 
                  making intelligent predictions and generating useful insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">AI Showcase</span>
          </div>
          <p className="text-muted-foreground">
            Running AI models directly in your browser
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
