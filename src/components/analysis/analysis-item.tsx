import { AlertTriangle, CheckCircle, Ghost } from 'lucide-react';
import { Badge } from '../ui/badge';
import { AnalysisItemI } from './analysis.interfaces';


const getIcon = (type: string) => {
  switch (type) {
    case 'Low':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'Medium':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'High':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <Ghost className="h-4 w-4 text-gray-500" />;
  }
};

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'Low':
      return 'default'; // Green
    case 'Medium':
      return 'warning'; // Yellow
    case 'High':
      return 'destructive'; // Red
    default:
      return 'outline'; // Gray
  }
};


export const AnalysisItemCard = ({ item }: { item: AnalysisItemI }) => {
  return (
    <div className="p-4 border border-border rounded-lg min-h-[100px] w-full">
      <div className="flex items-start gap-3 h-full w-full">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(item.risk_status)}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-2">
            <h5 className="font-medium text-sm leading-tight break-words flex-1 min-w-0">{item.title}</h5>
            <div className="flex-shrink-0 w-full sm:w-auto sm:max-w-[40%]">
              <div className={`block rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors break-words whitespace-normal leading-tight ${getBadgeVariant(item.risk_status) === 'default' ? 'border-transparent bg-primary text-primary-foreground' : 
                getBadgeVariant(item.risk_status) === 'warning' ? 'border-transparent bg-yellow-500 text-yellow-900' :
                getBadgeVariant(item.risk_status) === 'destructive' ? 'border-transparent bg-destructive text-destructive-foreground' :
                'border-transparent bg-gray-200 text-gray-700'}`}>
                {item.risk_status}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed break-words hyphens-auto">{item.explanation}</p>
          {/* <p className="text-xs text-muted-foreground">Source: {item.document}</p> */}
        </div>
      </div>
    </div>
  )
}