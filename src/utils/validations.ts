export const formatArrayPath = (path: string) =>
  path.replaceAll('[', '.').replaceAll(']', '')
