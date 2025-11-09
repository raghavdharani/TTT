/**
 * Saved Sessions Component
 * Manages saved search sessions
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { sessionsApi, SearchSession } from '../../services/sessionsApi';

interface SavedSessionsProps {
  onLoadSession: (session: SearchSession) => void;
  currentSearchQuery?: string;
  currentFilters?: any;
  currentSortConfig?: any;
  currentVendorMode?: 'primary' | 'secondary';
}

export function SavedSessions({ 
  onLoadSession, 
  currentSearchQuery, 
  currentFilters, 
  currentSortConfig,
  currentVendorMode 
}: SavedSessionsProps) {
  const [sessions, setSessions] = useState<SearchSession[]>([]);
  const [open, setOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    if (open) {
      loadSessions();
    }
  }, [open]);

  const loadSessions = async () => {
    try {
      const data = await sessionsApi.findAll();
      setSessions(data || []);
    } catch (error: any) {
      // If API fails (backend not running), try loading from localStorage
      console.warn('Failed to load sessions from API, trying localStorage:', error.message);
      try {
        const localSessions = JSON.parse(localStorage.getItem('savedSessions') || '[]');
        setSessions(localSessions);
      } catch (e) {
        setSessions([]);
      }
    }
  };

  const handleSave = async () => {
    if (!sessionName.trim()) return;

    try {
      await sessionsApi.create({
        name: sessionName,
        searchQuery: currentSearchQuery,
        filters: currentFilters,
        sortConfig: currentSortConfig,
        vendorMode: currentVendorMode,
      });
      setSessionName('');
      setSaveDialogOpen(false);
      loadSessions();
    } catch (error: any) {
      // If API fails, save to localStorage as fallback
      console.warn('Failed to save session to API, saving to localStorage:', error.message);
      const savedSessions = JSON.parse(localStorage.getItem('savedSessions') || '[]');
      const newSession = {
        id: `local-${Date.now()}`,
        userId: 'local-user',
        name: sessionName,
        searchQuery: currentSearchQuery,
        filters: currentFilters,
        sortConfig: currentSortConfig,
        vendorMode: currentVendorMode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      savedSessions.push(newSession);
      localStorage.setItem('savedSessions', JSON.stringify(savedSessions));
      setSessionName('');
      setSaveDialogOpen(false);
      loadSessions();
    }
  };

  const handleLoad = async (session: SearchSession) => {
    onLoadSession(session);
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await sessionsApi.delete(id);
      loadSessions();
    } catch (error: any) {
      // If API fails, delete from localStorage
      console.warn('Failed to delete session from API, deleting from localStorage:', error.message);
      const savedSessions = JSON.parse(localStorage.getItem('savedSessions') || '[]');
      const filtered = savedSessions.filter((s: any) => s.id !== id);
      localStorage.setItem('savedSessions', JSON.stringify(filtered));
      loadSessions();
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="flex items-center gap-2">
        <span>Saved Searches</span>
        {sessions.length > 0 && (
          <span className="bg-[#1976D2] text-white text-xs rounded-full px-2 py-0.5">
            {sessions.length}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Saved Search Sessions</DialogTitle>
          </DialogHeader>
          
          {/* Save Current Search Button - Prominent */}
          <div className="mb-4 pb-4 border-b">
            <Button 
              className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white"
              onClick={() => setSaveDialogOpen(true)}
            >
              Save Current Search
            </Button>
          </div>

          {/* Save Dialog - Separate */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Search Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input
                    id="session-name"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Enter session name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && sessionName.trim()) {
                        handleSave();
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>This will save:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Current search query: {currentSearchQuery || '(none)'}</li>
                    <li>Active filters: {currentFilters && Object.keys(currentFilters).length > 0 ? 'Yes' : 'No'}</li>
                    <li>Sort configuration: {currentSortConfig ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleSave} 
                  className="w-full bg-[#1976D2] hover:bg-[#1565C0]"
                  disabled={!sessionName.trim()}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Saved Sessions List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved sessions yet</p>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => handleLoad(session)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-gray-900">{session.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Updated: {new Date(session.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {session.searchQuery && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        Query: {session.searchQuery}
                      </div>
                    )}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(session.id);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

