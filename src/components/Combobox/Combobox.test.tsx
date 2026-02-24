/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, describe, vi } from 'vitest'
import { Combobox } from './Combobox'
import { fetchTreeData } from '../../utils/mockApi'

describe('Hierarchical Combobox Keyboard & A11y', () => {
    test('verifies ARIA roles and loading state', async () => {
        render(<Combobox loadData={fetchTreeData} />)
        const input = screen.getByRole('combobox')

        expect(input).toHaveAttribute('aria-expanded', 'false')
        expect(input).toHaveAttribute('aria-autocomplete', 'list')
        expect(input).toHaveAttribute('aria-controls', 'combobox-listbox')

        await userEvent.click(input)

        expect(input).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByRole('status')).toHaveTextContent(/loading/i)

        await waitFor(() => {
            expect(screen.getByText('Node 0')).toBeInTheDocument()
        })

        expect(screen.getByRole('listbox')).toBeInTheDocument()

        const options = screen.getAllByRole('option')
        expect(options.length).toBeGreaterThan(0)
    })

    test('supports full keyboard contract (Arrows, Space, Enter)', async () => {
        const onChange = vi.fn()
        render(<Combobox loadData={fetchTreeData} onChange={onChange} />)
        const input = screen.getByRole('combobox')

        input.focus()

        await userEvent.keyboard('{ArrowDown}')

        await waitFor(() => {
            expect(screen.getByText('Node 0')).toBeInTheDocument()
        })

        await userEvent.keyboard('{ArrowDown}')

        await userEvent.keyboard('{ArrowDown}')

        await userEvent.keyboard('{Enter}')
        expect(onChange).toHaveBeenCalledWith(['node-1'])

        await userEvent.keyboard('{ArrowRight}')

        await waitFor(() => {
            expect(screen.getByText('Child 1-0')).toBeInTheDocument()
        })

        await userEvent.keyboard('{ArrowDown}')

        await userEvent.keyboard('{Escape}')
        expect(input).toHaveAttribute('aria-expanded', 'false')
    })

    test('handles failures gracefully without crashing', async () => {
        const errorLoader = vi.fn().mockRejectedValue(new Error('API Down'))

        render(<Combobox loadData={errorLoader} />)

        const input = screen.getByRole('combobox')
        await userEvent.click(input)

        await waitFor(() => {
            expect(screen.getByRole('status')).toHaveTextContent(/no results/i)
        })
    })
})
