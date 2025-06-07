import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { reviewService } from '@/lib/services/review.service';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { StarIcon } from 'lucide-react';

const MAX_CHARACTERS = 500;

interface ReviewFormProps {
  courseId?: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ courseId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARACTERS) {
      setComment(newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Comment required',
        description: 'Please write your review before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.addReview({
        userId: user.$id,
        userName: user.name || 'Anonymous',
        userAvatar: user.avatar,
        rating,
        comment,
        courseId,
      });

      setComment('');
      setRating(5);
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });
      onReviewSubmitted?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none">
            <StarIcon
              className={`w-6 h-6 ${
                star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Write your review..."
          value={comment}
          onChange={handleCommentChange}
          className="min-h-[100px]"
        />
        <p className="text-sm text-muted-foreground text-right">
          {comment.length}/{MAX_CHARACTERS} characters
        </p>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
