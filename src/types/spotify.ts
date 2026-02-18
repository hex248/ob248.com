export type Progress = {
  progress_ms: number;
  duration_ms: number;
};

export type CurrentlyPlaying = {
  id: string;
  message: string;
  device?: Device;
  repeat_state?: string;
  shuffle_state?: boolean;
  timestamp?: number;
  progress_ms?: number;
  is_playing?: boolean;
  currently_playing_type?: string;
  item: TrackObject | EpisodeObject | undefined;
  isPlaylist?: boolean;
  playlistName?: string;
  playlistImage?: string;
  playlistAuthor?: string;
  playlistDescription?: string;
};

export type Device = {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
};

export type TrackObject = {
  name: string;
  album: Album;
  artistImages: string[];
  track_number: number;
  artists: Artist[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  external_urls: ExternalURLs;
  is_playable: boolean;
  restrictions: Restriction;
  is_local: boolean;
  preview_url: string;
};

export type Album = {
  album_type: string;
  total_tracks: number;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: Restriction;
  type: string;
  uri: string;
  artists: Artist[];
};

type Image = {
  url: string;
  height: number;
  width: number;
};

type Restriction = {
  reason: string;
};

export type Artist = {
  id: string;
  name: string;
  images: Image[];
  genres: string[];
  popularity: number;
  external_urls: ExternalURLs;
  href: string;
  uri: string;
};

type ExternalURLs = {
  spotify: string;
};

export type EpisodeObject = {
  id: string;
  name: string;
  artistImages?: string;
  release_date: string;
  release_date_precision: string;
  show: Show;
  resume_point: ResumePoint;
  audio_preview_url: string;
  description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalURLs;
  images: Image[];
  is_playable: boolean;
  restrictions: Restriction;
};

export type Show = {
  id: string;
  name: string;
  publisher: string;
  external_urls: ExternalURLs;
  images: Image[];
  media_type: string;
  description: string;
  explicit: boolean;
  total_episodes: number;
};

type ResumePoint = {
  fully_played: boolean;
  resume_position_ms: number;
};
