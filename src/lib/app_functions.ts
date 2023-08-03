import constants from '../common/constants';

class AppFunctions {
  public userSortFields(sortBy: string, order: string) {
    let sortOrder: number = -1;
    order === 'desc' ? (sortOrder = -1) : (sortOrder = 1);
    switch (sortBy) {
      case constants.ENUMS.USER_LIST_SORT_BY.FULL_NAME:
        return { firstName: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.EMAIL:
        return { email: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.LASTACTIVITY:
        return { lastActivity: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.PLAN:
        return { plan: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.TYPE:
        return { type: sortOrder };
      default:
        return { createdAt: -1 };
    }
  }
}

export default new AppFunctions();
