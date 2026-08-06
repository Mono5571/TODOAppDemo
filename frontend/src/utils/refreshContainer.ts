export function refreshContainer(container: HTMLElement) {
  while (container.firstElementChild) {
    container.removeChild(container.firstElementChild);
  }
}
