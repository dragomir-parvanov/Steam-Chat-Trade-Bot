/**
 * Equalizing models, so the model can be compared to another model from the same type
 * @param {Record<string, any>} model
 * @returns
 */
export default function equalizeModel(model: Record<string, any>): string {
  const ordered = {};
  Object.keys(model)
    .sort()
    .forEach(function (key) {
      ordered[key] = model[key];
    });
  return decodeURI(JSON.stringify(ordered, null, 1));
}
