import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MenuCard from '../components/MenuCard';
import SearchFilter from '../components/SearchFilter';

const Menu: React.FC = () => {
  const { state } = useApp();

  const filteredItems = useMemo(() => {
    let filtered = state.menuItems;

    // Filter by category
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === state.selectedCategory);
    }

    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [state.menuItems, state.selectedCategory, state.searchQuery]);

  const groupedItems = useMemo(() => {
    if (state.selectedCategory !== 'all') {
      return { [state.selectedCategory]: filteredItems };
    }

    return filteredItems.reduce((groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    }, {} as Record<string, typeof filteredItems>);
  }, [filteredItems, state.selectedCategory]);

  const categoryTitles = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    drinks: 'Drinks',
    desserts: 'Desserts'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our delicious selection of carefully crafted dishes
          </p>
        </div>

        {/* Search and Filter */}
        <SearchFilter />

        {/* Menu Items */}
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No items found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedItems).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 capitalize border-b-2 border-orange-600 pb-2 inline-block">
                  {categoryTitles[category as keyof typeof categoryTitles] || category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;