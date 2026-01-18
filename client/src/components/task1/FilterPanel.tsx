import { useQuery } from '@tanstack/react-query';
import { fetchFilters } from '../../services/api';

interface FilterPanelProps {
  selectedHobbies: string[];
  selectedNationalities: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  onNationalitiesChange: (nationalities: string[]) => void;
}

export function FilterPanel({
  selectedHobbies,
  selectedNationalities,
  onHobbiesChange,
  onNationalitiesChange,
}: FilterPanelProps) {
  const { data: filters, isLoading } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
  });

  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      onHobbiesChange(selectedHobbies.filter((h) => h !== hobby));
    } else {
      onHobbiesChange([...selectedHobbies, hobby]);
    }
  };

  const toggleNationality = (nationality: string) => {
    if (selectedNationalities.includes(nationality)) {
      onNationalitiesChange(selectedNationalities.filter((n) => n !== nationality));
    } else {
      onNationalitiesChange([...selectedNationalities, nationality]);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading filters...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Hobbies</h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {filters?.hobbies.map((hobby) => (
            <label key={hobby} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedHobbies.includes(hobby)}
                onChange={() => toggleHobby(hobby)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{hobby}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Nationalities</h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {filters?.nationalities.map((nationality) => (
            <label key={nationality} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedNationalities.includes(nationality)}
                onChange={() => toggleNationality(nationality)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{nationality}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
