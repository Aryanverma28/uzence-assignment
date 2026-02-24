import { Combobox } from './components/Combobox/Combobox'
import { fetchTreeData } from './utils/mockApi'

function App() {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 pt-20">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-text-color">
          Hierarchical Combobox
        </h1>
        <p className="text-surface-600 dark:text-surface-300">
          Search, expand, and select from a virtualized async tree.
        </p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-900 border border-border-color rounded-xl p-6 shadow-sm">
        <label className="block text-sm font-medium text-text-color mb-2">
          Select Categories
        </label>
        <Combobox
          loadData={fetchTreeData}
          onChange={(selected) => console.log('Selected IDs:', selected)}
        />
      </div>
    </div>
  )
}

export default App
