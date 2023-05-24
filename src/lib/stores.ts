import { writable, derived } from 'svelte/store';
import { aspect_ratio } from './chart_config';

export const width = writable(1000);
export const height = derived(width, $width => Math.round($width / aspect_ratio));