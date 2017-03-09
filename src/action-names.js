import i from 'i';
const inflector = i();

export default function (resourceName) {
  const singular = inflector.singularize(resourceName);
  const prefix = singular.toUpperCase();

  return {
    findAllStart: `${prefix}@FINDALL_START`,
    findAllSuccess: `${prefix}@FINDALL_SUCCESS`,
    findAllError: `${prefix}@FINDALL_ERROR`,

    findOneStart: `${prefix}@FINDONE_START`,
    findOneSuccess: `${prefix}@FINDONE_SUCCESS`,
    findOneError: `${prefix}@FINDONE_ERROR`,

    createStart: `${prefix}@CREATE_START`,
    createSuccess: `${prefix}@CREATE_SUCCESS`,
    createError: `${prefix}@CREATE_ERROR`,

    updateStart: `${prefix}@UPDATE_START`,
    updateSuccess: `${prefix}@UPDATE_SUCCESS`,
    updateError: `${prefix}@UPDATE_ERROR`,

    deleteStart: `${prefix}@DELETE_START`,
    deleteSuccess: `${prefix}@DELETE_SUCCESS`,
    deleteError: `${prefix}@DELETE_ERROR`,
  };
}
