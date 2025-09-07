import { AlertTriangle, CheckCircle, Ghost } from 'lucide-react';
import { Badge } from '../ui/badge';
import { AnalysisItemI } from './analysis.interfaces';


const getIcon = (type: string) => {
  switch (type) {
    case 'Low':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'Medium':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'High':
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    default:
      return <Ghost className="h-4 w-4 text-disabled" />;
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'Low':
      return 'default';
    case 'Medium':
      return 'destructive';
    case 'High':
      return 'secondary';
    default:
      return 'default';
  }
};


export const AnalysisItemCard = ({ item }: { item: AnalysisItemI }) => {
  return (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-start gap-3">
        {getIcon(item.risk_status)}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-medium">{item.title}</h5>
            <Badge variant={getBadgeVariant(item.risk_status) as any}>
              {item.risk_status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{item.explanation}</p>
          {/* <p className="text-xs text-muted-foreground">Source: {item.document}</p> */}
        </div>
      </div>
    </div>
  )
}