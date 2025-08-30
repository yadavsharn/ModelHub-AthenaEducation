import React, { useState } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Frown, Meh, Loader2 } from 'lucide-react';

interface SentimentResult {
  label: string;
  score: number;
}

const getSentimentIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'positive':
      return <Heart className="w-4 h-4" />;
    case 'negative':
      return <Frown className="w-4 h-4" />;
    default:
      return <Meh className="w-4 h-4" />;
  }
};

const getSentimentColor = (label: string) => {
  switch (label.toLowerCase()) {
    case 'positive':
      return 'bg-green-500';
    case 'negative':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
};

export const SentimentAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const classifier = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );

      const output = await classifier(text) as SentimentResult[];
      setResult(output[0]);
    } catch (error) {
      console.error('Sentiment analysis error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exampleTexts = [
    "I absolutely love this new AI technology!",
    "This is really disappointing and frustrating.",
    "The weather is okay today, nothing special.",
  ];

  return (
    <Card className="w-full bg-card shadow-card border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Sentiment Analyzer
        </CardTitle>
        <CardDescription>
          Enter any text and our AI will determine if the sentiment is positive, negative, or neutral
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-24 resize-none"
          />
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try examples:</span>
            {exampleTexts.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setText(example)}
                className="text-xs"
              >
                "{example.slice(0, 30)}..."
              </Button>
            ))}
          </div>
        </div>

        <Button
          variant="hero"
          onClick={analyzeSentiment}
          disabled={!text.trim() || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Sentiment'
          )}
        </Button>

        {result && (
          <div className="space-y-4 animate-slide-up">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(result.label)}
                  <span className="font-semibold capitalize">{result.label}</span>
                </div>
                <Badge variant="secondary">
                  {(result.score * 100).toFixed(1)}% confident
                </Badge>
              </div>
              <Progress
                value={result.score * 100}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Positive</div>
                <div className={`h-2 rounded mt-1 ${
                  result.label.toLowerCase() === 'positive' ? 'bg-green-500' : 'bg-muted-foreground/20'
                }`} style={{
                  width: result.label.toLowerCase() === 'positive' ? `${result.score * 100}%` : '0%'
                }} />
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Neutral</div>
                <div className={`h-2 rounded mt-1 ${
                  result.label.toLowerCase() === 'neutral' ? 'bg-yellow-500' : 'bg-muted-foreground/20'
                }`} style={{
                  width: result.label.toLowerCase() === 'neutral' ? `${result.score * 100}%` : '0%'
                }} />
              </div>
              <div className="p-2 bg-muted rounded">
                <div className="text-xs text-muted-foreground">Negative</div>
                <div className={`h-2 rounded mt-1 ${
                  result.label.toLowerCase() === 'negative' ? 'bg-red-500' : 'bg-muted-foreground/20'
                }`} style={{
                  width: result.label.toLowerCase() === 'negative' ? `${result.score * 100}%` : '0%'
                }} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">How it works:</h4>
          <p className="text-sm text-muted-foreground">
            This AI uses DistilBERT, a transformer model that understands language context 
            and emotion. It was trained on thousands of movie reviews to learn the subtle 
            patterns that indicate positive or negative feelings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};