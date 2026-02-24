import type { Meta, StoryObj } from '@storybook/react'
import { Combobox } from './Combobox'
import { fetchTreeData } from '../../utils/mockApi'
import { expect, userEvent, within } from '@storybook/test'

const meta: Meta<typeof Combobox> = {
  title: 'Components/HierarchicalCombobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '3rem', width: '100%', minWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  args: {
    loadData: fetchTreeData,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('Open combobox', async () => {
      const input = canvas.getByRole('combobox')
      await userEvent.click(input)

      await expect(input).toHaveAttribute('aria-expanded', 'true')
    })
  },
}

export const LoadingState: Story = {
  args: {
    loadData: () => new Promise((resolve) => setTimeout(resolve, 999999)),
  },
}

export const EmptyState: Story = {
  args: {
    loadData: async () => [],
  },
}

export const ErrorState: Story = {
  args: {
    loadData: async () => {
      throw new Error('Failed to load')
    },
  },
}

export const DeeplyNestedEdgeCase: Story = {
  args: {
    loadData: async (parentId) => {
      if (!parentId) {
        return [{ id: 'lvl-1', label: 'Level 1', hasChildren: true }]
      }
      const parts = parentId.split('-')
      const level = parseInt(parts[1] || '0', 10)
      if (level >= 10) return []
      return [
        {
          id: `lvl-${level + 1}`,
          label: `Level ${level + 1}`,
          hasChildren: true,
        },
      ]
    },
  },
}

export const HighContrastMode: Story = {
  args: {
    loadData: fetchTreeData,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div
        className="dark text-surface-50 bg-surface-900 override-high-contrast"
        style={{
          padding: '3rem',
          width: '100%',
          minWidth: '400px',
          outline: '2px solid white',
        }}
      >
        <Story />
      </div>
    ),
  ],
}
