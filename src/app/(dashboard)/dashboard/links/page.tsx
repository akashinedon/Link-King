'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    GripVertical,
    Trash2,
    ExternalLink,
    Loader2,
    Eye,
    EyeOff,
    Edit3,
    Check,
    X
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconPicker, { getIconComponent } from '@/components/dashboard/icon-picker';

interface Link {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    order: number;
    isActive: boolean;
    clicks: number;
}

export default function LinksPage() {
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newLink, setNewLink] = useState({ title: '', url: '', icon: '' });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/links');
            const data = await res.json();
            setLinks(data);
        } catch (error) {
            console.error('Failed to fetch links:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLink.title || !newLink.url) return;

        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLink),
            });

            if (res.ok) {
                const link = await res.json();
                setLinks([...links, link]);
                setNewLink({ title: '', url: '', icon: '' });
                setIsAdding(false);
            }
        } catch (error) {
            console.error('Failed to add link:', error);
        }
    };

    const handleDeleteLink = async (id: string) => {
        try {
            await fetch(`/api/links/${id}`, { method: 'DELETE' });
            setLinks(links.filter(link => link.id !== id));
        } catch (error) {
            console.error('Failed to delete link:', error);
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await fetch(`/api/links/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive }),
            });
            setLinks(links.map(link =>
                link.id === id ? { ...link, isActive } : link
            ));
        } catch (error) {
            console.error('Failed to toggle link:', error);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = links.findIndex(link => link.id === active.id);
            const newIndex = links.findIndex(link => link.id === over.id);

            const newLinks = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
                ...link,
                order: index,
            }));

            setLinks(newLinks);

            // Update order in database
            try {
                await fetch('/api/links', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        links: newLinks.map(link => ({ id: link.id, order: link.order })),
                    }),
                });
            } catch (error) {
                console.error('Failed to update order:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Links
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Add, edit, and reorder your links
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                </button>
            </div>

            {/* Add Link Form */}
            {isAdding && (
                <div className="card p-6 mb-6 animate-slide-down">
                    <form onSubmit={handleAddLink} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="My Website"
                                    value={newLink.title}
                                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">URL</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    placeholder="https://example.com"
                                    value={newLink.url}
                                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <IconPicker
                            value={newLink.icon}
                            onChange={(icon) => setNewLink({ ...newLink, icon })}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewLink({ title: '', url: '', icon: '' });
                                }}
                                className="btn-ghost"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                Add Link
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Links List */}
            {links.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No links yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Add your first link to get started
                    </p>
                    <button onClick={() => setIsAdding(true)} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Link
                    </button>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={links.map(link => link.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {links.map((link) => (
                                <SortableLinkItem
                                    key={link.id}
                                    link={link}
                                    onDelete={handleDeleteLink}
                                    onToggle={handleToggleActive}
                                    onUpdate={(updatedLink) => {
                                        setLinks(links.map(l => l.id === updatedLink.id ? updatedLink : l));
                                    }}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}


        </div>
    );
}

interface SortableLinkItemProps {
    link: Link;
    onDelete: (id: string) => void;
    onToggle: (id: string, isActive: boolean) => void;
    onUpdate: (link: Link) => void;
}

function SortableLinkItem({ link, onDelete, onToggle, onUpdate }: SortableLinkItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: link.title, url: link.url });

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 0,
        position: isDragging ? 'relative' as const : undefined,
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/links/${link.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            if (res.ok) {
                onUpdate({ ...link, ...editData });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update link:', error);
        }
    };

    const IconComponent = getIconComponent(link.icon);
    const isCustomUrl = link.icon?.startsWith('http') || false;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:border-violet-500/50 transition-all duration-300 ${!link.isActive ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' : ''}`}
        >
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                title="Drag to reorder"
            >
                <GripVertical className="w-5 h-5" />
            </button>

            {/* Icon Preview */}
            <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                {isCustomUrl ? (
                    <img src={link.icon!} alt={link.title} className="w-6 h-6 object-cover rounded-md" />
                ) : (
                    <IconComponent className="w-5 h-5" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                        <div className="flex-1 w-full space-y-2 sm:space-y-0 sm:flex sm:gap-2">
                            <input
                                type="text"
                                className="input-field py-1.5 px-3 text-sm w-full sm:w-1/3"
                                placeholder="Title"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            />
                            <input
                                type="url"
                                className="input-field py-1.5 px-3 text-sm w-full sm:w-2/3"
                                placeholder="URL"
                                value={editData.url}
                                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-1 mt-2 sm:mt-0">
                            <button onClick={handleSave} className="p-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setIsEditing(false)} className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <p className="font-semibold text-gray-900 dark:text-white truncate text-base">
                            {link.title}
                        </p>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-violet-500 truncate hover:underline flex items-center gap-1">
                            {link.url}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                )}
            </div>

            {/* Stats Badge */}
            {!isEditing && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{link.clicks}</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                    className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(link.id, !link.isActive);
                    }}
                    className={`p-2 rounded-lg transition-colors ${link.isActive ? 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300' : 'text-gray-400 hover:text-green-500'}`}
                    title={link.isActive ? 'Hide' : 'Show'}
                >
                    {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(link.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
