<?php

namespace App\Traits;

trait HasDataOwnership
{
    /**
     * Check if user can access all data (admin role).
     */
    protected function canAccessAllData(): bool
    {
        return auth()->user()->hasRole('admin');
    }

    /**
     * Check if user should only see their own data.
     */
    protected function shouldFilterByOwnership(): bool
    {
        return auth()->user()->hasRole('operator') && !$this->canAccessAllData();
    }

    /**
     * Apply ownership filter to query if needed.
     */
    protected function applyOwnershipFilter($query)
    {
        // For development: Let admin and operators see all data
        // Remove this condition in production if strict ownership is needed
        if (auth()->user()->hasRole('admin') || auth()->user()->hasRole('operator')) {
            return $query;
        }
        
        if ($this->shouldFilterByOwnership()) {
            return $query->ownedBy(auth()->id());
        }
        
        return $query;
    }

    /**
     * Check if user can access specific record.
     */
    protected function canAccessRecord($record): bool
    {
        // Admin can access all records
        if ($this->canAccessAllData()) {
            return true;
        }

        // Operator can only access their own records
        if ($this->shouldFilterByOwnership()) {
            return $record->created_by == auth()->id();
        }

        // Viewer should not have access to edit/delete
        return false;
    }

    /**
     * Set created_by field when creating new record.
     */
    protected function setCreatedBy(array &$data): void
    {
        $data['created_by'] = auth()->id();
    }
}
