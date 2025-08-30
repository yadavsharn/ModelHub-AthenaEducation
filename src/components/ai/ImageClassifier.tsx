import React, { useState, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Prediction {
  label: string;
  score: number;
}

export const ImageClassifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setPredictions([]);

    setIsProcessing(true);
    try {
      const classifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
        { device: 'webgpu' }
      );

      const result = await classifier(imageUrl) as Prediction[];
      setPredictions(result.slice(0, 5));
    } catch (error) {
      console.error('Classification error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  return (
    <Card className="w-full bg-card shadow-card border-border animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          Image Classifier
        </CardTitle>
        <CardDescription>
          Upload an image and our AI will identify what's in it using computer vision
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-primary bg-gradient-hero'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {image ? (
            <div className="space-y-4">
              <img
                src={image}
                alt="Uploaded"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setImage(null);
                  setPredictions([]);
                }}
              >
                Upload Different Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Drop an image here</p>
                <p className="text-sm text-muted-foreground">or click to select</p>
              </div>
              <Button
                variant="hero"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) handleFiles(files);
                  };
                  input.click();
                }}
              >
                Choose Image
              </Button>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="space-y-2 animate-scale-in">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Analyzing image...</span>
            </div>
            <Progress value={undefined} className="w-full" />
          </div>
        )}

        {predictions.length > 0 && (
          <div className="space-y-4 animate-slide-up">
            <h3 className="text-lg font-semibold">Predictions</h3>
            <div className="space-y-2">
              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <span className="font-medium">{prediction.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {(prediction.score * 100).toFixed(1)}%
                    </Badge>
                    <Progress
                      value={prediction.score * 100}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">How it works:</h4>
          <p className="text-sm text-muted-foreground">
            This AI uses a MobileNetV4 neural network trained on millions of images. 
            It analyzes patterns in pixels to recognize objects, animals, and scenes 
            with remarkable accuracy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};