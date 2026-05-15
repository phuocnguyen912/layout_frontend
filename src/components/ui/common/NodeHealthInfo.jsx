import InfoBox from '../InfoBox';
import { formatDateTime } from '../../../utils/format';

export default function NodeHealthInfo({ health, fallbackMode = 'node' }) {
  return (
    <InfoBox title="Tình trạng kết nối">
      <p>Chế độ: {health?.mode || fallbackMode}</p>
      <p className="mt-1">Thời gian: {formatDateTime(health?.timestamp)}</p>
    </InfoBox>
  );
}
