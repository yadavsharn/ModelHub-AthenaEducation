import React, { useState } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, Copy, Check } from 'lucide-react';

export const TextSummarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const summarizeText = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const summarizer = await pipeline(
        'summarization',
        'Xenova/distilbart-cnn-6-6'
      );

      const output = await summarizer(text) as any[];
      
      setSummary(output[0].summary_text || output[0].generated_text || 'Summary generated successfully.');
    } catch (error) {
      console.error('Summarization error:', error);
      setSummary('Sorry, there was an error processing your text. Please try with a shorter text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleText = `Artificial intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. The ideal characteristic of artificial intelligence is its ability to rationalize and take actions that have the best chance of achieving a specific goal. Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Deep learning is a subset of machine learning that uses neural networks with three or more layers to simulate the behavior of the human brain, allowing it to learn from large amounts of data.`;

  return (
    <Card className="w-full bg-card shadow-card border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Text Summarizer
        </CardTitle>
        <CardDescription>
          Paste a long article or text and our AI will create a concise summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Paste your long text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32 resize-none"
          />
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setText(exampleText)}
            >
              Load Example Text
            </Button>
            <Badge variant="secondary">
              {text.length} characters
            </Badge>
          </div>
        </div>

        <Button
          variant="hero"
          onClick={summarizeText}
          disabled={!text.trim() || isProcessing || text.length < 50}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Summarizing...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>

        {text.length > 0 && text.length < 50 && (
          <p className="text-sm text-muted-foreground text-center">
            Please enter at least 50 characters for better summarization
          </p>
        )}

        {summary && (
          <div className="space-y-4 animate-slide-up">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Summary</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm leading-relaxed">{summary}</p>
              <div className="mt-3 flex gap-2">
                <Badge variant="outline">
                  Original: {text.length} chars
                </Badge>
                <Badge variant="outline">
                  Summary: {summary.length} chars
                </Badge>
                <Badge variant="secondary">
                  {Math.round((1 - summary.length / text.length) * 100)}% shorter
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">How it works:</h4>
          <p className="text-sm text-muted-foreground">
            This AI uses DistilBART, a transformer model specialized in text summarization. 
            It identifies the most important sentences and ideas, then rewrites them in a 
            concise way while preserving the core meaning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};