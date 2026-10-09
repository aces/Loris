import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {HEDSchemaElement, HEDTag} from '../../domain/types';

export type HEDState = {
  hedSchema: HEDSchemaElement[],
  datasetTags: Record<string, Record<string, HEDTag[]>>,
  relOverrides: HEDTag[],
  addedTags: HEDTag[],
  deletedTags: HEDTag[],
  tagsHaveChanges: boolean,
};

type HEDContextValue = HEDState & {
  setDatasetTags: React.Dispatch<React.SetStateAction<
    Record<string, Record<string, HEDTag[]>>
  >>,
  setRelOverrides: React.Dispatch<React.SetStateAction<HEDTag[]>>,
  setAddedTags: React.Dispatch<React.SetStateAction<HEDTag[]>>,
  setDeletedTags: React.Dispatch<React.SetStateAction<HEDTag[]>>,
  setTagsHaveChanges: React.Dispatch<React.SetStateAction<boolean>>,
};

const HEDContext = createContext<HEDContextValue | undefined>(undefined);

/** Own the editable HED dataset-tagging state for one recording. */
export function HEDProvider({children, initialState, unsavedChangesMessage}: {
  children: React.ReactNode,
  initialState: HEDState,
  unsavedChangesMessage: string,
}) {
  const [datasetTags, setDatasetTags] = useState(initialState.datasetTags);
  const [relOverrides, setRelOverrides] = useState(initialState.relOverrides);
  const [addedTags, setAddedTags] = useState(initialState.addedTags);
  const [deletedTags, setDeletedTags] = useState(initialState.deletedTags);
  const [tagsHaveChanges, setTagsHaveChanges] = useState(
    initialState.tagsHaveChanges
  );

  useEffect(() => {
    /** Warn before leaving when HED edits have not been saved. */
    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      if (addedTags.length > 0 || deletedTags.length > 0) {
        event.preventDefault();
        event.returnValue = unsavedChangesMessage;
        return unsavedChangesMessage;
      }
      return undefined;
    };

    window.addEventListener('beforeunload', warnAboutUnsavedChanges);
    return () => {
      window.removeEventListener('beforeunload', warnAboutUnsavedChanges);
    };
  }, [addedTags, deletedTags, unsavedChangesMessage]);

  const value = useMemo(() => ({
    hedSchema: initialState.hedSchema,
    datasetTags,
    relOverrides,
    addedTags,
    deletedTags,
    tagsHaveChanges,
    setDatasetTags,
    setRelOverrides,
    setAddedTags,
    setDeletedTags,
    setTagsHaveChanges,
  }), [
    initialState.hedSchema,
    datasetTags,
    relOverrides,
    addedTags,
    deletedTags,
    tagsHaveChanges,
  ]);

  return <HEDContext.Provider value={value}>{children}</HEDContext.Provider>;
}

/** Access HED schema and dataset-tagging state for the current recording. */
export function useHED(): HEDContextValue {
  const context = useContext(HEDContext);
  if (context === undefined) {
    throw new Error('useHED must be used within a HEDProvider');
  }
  return context;
}
