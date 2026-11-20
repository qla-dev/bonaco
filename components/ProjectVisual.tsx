import { asset } from '../lib/asset';
import { WEB_PREVIEWS, PANEL_PREVIEWS, projectNeedsFrame } from '../data/projectPresentation';
import type { Project } from '../types';
import FramedImage from './FramedImage';
import ImageRipple from './ImageRipple';

/** One shared device silhouette keeps the three web projects at the same scale. */
export default function ProjectVisual({ project, alt, loading = 'lazy', ripple = false }: {
  project: Project; alt: string; loading?: 'lazy' | 'eager'; ripple?: boolean;
}) {
  const screen = WEB_PREVIEWS[project.slug];
  if (screen) return <div className="project-visual project-visual-laptop">
    <img className="project-visual-backdrop" src={asset(screen)} alt="" aria-hidden="true" loading={loading} />
    <div className="project-laptop">
      <div className="project-laptop-display"><i aria-hidden="true" /><img src={asset(screen)} alt={alt} loading={loading} decoding="async" />{ripple && <ImageRipple target="img" />}</div>
      <div className="project-laptop-base" aria-hidden="true" />
    </div>
  </div>;
  const panel = PANEL_PREVIEWS[project.slug];
  if (panel) return <div className="project-visual project-visual-panel">
    <img className="project-visual-backdrop" src={asset(panel.src)} alt="" aria-hidden="true" loading={loading} />
    <div className="project-visual-window"><img src={asset(panel.src)} alt={alt} loading={loading} decoding="async" style={{objectFit: panel.fit, objectPosition: panel.position}} />{ripple && <ImageRipple target="img" />}</div>
  </div>;
  if (projectNeedsFrame(project)) return <FramedImage className="project-strip-frame" src={project.cover} alt={alt} loading={loading} ripple={ripple} />;
  return <div className="project-visual"><img className="project-visual-photo" src={asset(project.cover)} alt={alt} loading={loading} decoding="async" />{ripple && <ImageRipple target=".project-visual-photo" />}</div>;
}
