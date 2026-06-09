import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * Public route used as the Blink website URL (/encuesta/:id).
 * Redirects participants to the in-app survey flow.
 */
export default function EncuestaRedirect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate(`/encuestas/${id}`, { replace: true });
    } else {
      navigate('/encuestas', { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
}
