import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { AnalysisItemI } from './analysis.interfaces';


const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'concern':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    default:
      return <CheckCircle className="h-4 w-4" />;
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'success':
      return 'default';
    case 'concern':
      return 'destructive';
    case 'warning':
      return 'secondary';
    default:
      return 'default';
  }
};


export const AnalysisItemCard = ({ item }: { item: AnalysisItemI }) => {
  return (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-start gap-3">
        {getIcon(item.type)}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium">{item.title}</h5>
            <Badge variant={getBadgeVariant(item.type) as any}>
              {item.type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          <p className="text-xs text-muted-foreground">Source: {item.document}</p>
        </div>
      </div>
    </div>
  )
}