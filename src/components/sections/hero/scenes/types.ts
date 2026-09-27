/** Props every builder scene receives. */
export interface SceneProps<T> {
  content: T;
  /** True once the scene has faded in; false as soon as another tab is picked. */
  active: boolean;
  /** Changes every time the scene is (re)entered, restarting its intro animation. */
  enterId: number;
  stopAutoplay(): void;
  isAutoplay(): boolean;
}
