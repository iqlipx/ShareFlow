import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Calendar, Tag } from 'lucide-react';
import Select, { StylesConfig } from 'react-select';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

interface Option {
  value: string;
  label: string;
}

export function HistoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  const resources = useStore((state) => state.resources);
  const webhooks = useStore((state) => state.webhooks);
  const deleteResource = useStore((state) => state.deleteResource);

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || resource.createdAt.startsWith(selectedDate);
    const matchesTag = !selectedTag || resource.tags.includes(selectedTag);
    return matchesSearch && matchesDate && matchesTag;
  });

  const allTags = Array.from(new Set(resources.flatMap(r => r.tags)));

  // Build tag options: always show "Show All" at the top; show only top 7 if not showing all.
  const topTags = allTags.slice(0, 7);
  const tagOptions: Option[] = [
    { value: 'SHOW_ALL', label: 'Show All' },
    ...(!showAllTags ? topTags : allTags).map(tag => ({ value: tag, label: `#${tag}` })),
  ];

  const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937',
      border: '1px solid #374151',
      minHeight: '3rem',
      color: '#fff',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937',
      zIndex: 9999,
      overflowY: 'auto',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
          ? '#1e40af'
          : '#1f2937',
      color: state.isSelected || state.isFocused ? '#fff' : '#9ca3af',
      cursor: 'pointer',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Field */}
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 h-12 text-lg block w-full rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search resources..."
            />
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-1">
            Filter by Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-3 h-12 text-lg block w-full rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tag Filter using react-select */}
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-2 pl-10">
            Filter by Tag
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <div className="pl-10">
              <Select
                options={tagOptions}
                value={selectedTag ? { value: selectedTag, label: `#${selectedTag}` } : null}
                onChange={(option) => {
                  if (option?.value === 'SHOW_ALL') {
                    setShowAllTags(true);
                    setSelectedTag(null);
                  } else {
                    setSelectedTag(option ? option.value : null);
                  }
                }}
                placeholder="Select a tag..."
                maxMenuHeight={150}
                styles={customStyles}
                isSearchable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable History List */}
      <div className="max-h-96 overflow-y-auto space-y-4">
        {filteredResources.map(resource => {
          const webhook = webhooks.find(w => w.id === resource.webhookId);
          return (
            <div key={resource.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{resource.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(resource.createdAt), 'MMM d, yyyy HH:mm')}
                </span>
              </div>

              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                >
                  {resource.url}
                </a>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {webhook && (
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Sent to: {webhook.name}
                  </div>
                  <button
                    onClick={() => {
                      useStore.getState().deleteResource(resource.id);
                      toast.success('Resource deleted successfully');
                    }}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No resources found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
