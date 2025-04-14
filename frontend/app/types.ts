/**
 * @fileoverview Type definitions for dataset review data structures
 * @author EasyReview
 * @license MIT
 */

/**
 * Represents a complete dataset with metadata and review status
 */
export interface Dataset {
  /** Unique identifier for the dataset */
  id: string;
  /** Array of metadata blocks containing fields */
  metadatablocks: Array<Metadatablock>;
  /** Digital Object Identifier for the dataset */
  doi: string;
  /** URL of the repository hosting the dataset */
  site_url: string;
  /** Version number of the dataset */
  revision: number;
  /** Whether the dataset has been fully accepted */
  accepted: boolean;
  /** Date the dataset was created/modified */
  date: string;
  /** Optional ID of the reviewer */
  reviewer?: string;
}

/**
 * Represents a block of related metadata fields
 */
export interface Metadatablock {
  /** Unique identifier for the metadata block */
  id: string;
  /** Name of the metadata block */
  name: string;
  /** Optional description of the metadata block */
  description?: string;
  /** Array of primitive metadata fields */
  primitives: Array<Field>;
  /** Array of compound metadata fields */
  compounds: Array<Compound>;
}

/**
 * Represents a compound metadata field containing multiple primitive fields
 */
export interface Compound {
  /** Unique identifier for the compound field */
  id: string;
  /** Name of the compound field */
  name: string;
  /** Optional description of the compound field */
  description?: string;
  /** Whether the compound field has been accepted */
  accepted: boolean;
  /** Array of primitive fields contained in this compound */
  primitives: Field[];
}

/**
 * Represents a single metadata field with value and review status
 */
export interface Field {
  /** Unique identifier for the field */
  id: string;
  /** Name of the field */
  name: string;
  /** Optional description of the field */
  description?: string;
  /** Whether the field value has been accepted */
  accepted: boolean;
  /** Data type of the field */
  field_type: string;
  /** Array of chat messages discussing this field */
  chat: ChatMessage[];
  /** History of changes to the field */
  history: History;
  /** Current value of the field */
  value: any;
}

/**
 * Represents the change history of a field
 */
export interface History {
  /** Map of timestamps to field values */
  [key: string]: string | number;
}

/**
 * Represents a primitive field value
 */
export interface Primitive {
  /** Map of field names to values */
  [key: string]: string | number | boolean;
}

/**
 * Contains statistics about field review progress
 */
export interface Statistic {
  /** Total number of fields to review */
  field_count: number;
  /** Number of fields that have been accepted */
  accpected_count: number;
}

/**
 * Represents a chat message in a field discussion
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** User who wrote the message */
  user: string;
  /** When the message was sent */
  timestamp: string;
  /** Content of the message */
  message: string;
}

/**
 * Tracks which compound fields are expanded in the UI
 */
export interface OpenCompoundField {
  /** Name of the compound field */
  name: string;
  /** Array of expanded child field IDs */
  childFields: string[];
}

/**
 * Tracks which fields are expanded in the UI
 */
export interface OpenFields {
  /** Name of the metadata block */
  name: string;
  /** Array of expanded primitive field IDs */
  primitives: string[];
  /** Array of expanded compound fields */
  compounds: OpenCompoundField[];
}
