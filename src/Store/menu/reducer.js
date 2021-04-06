export const initState = {
  menuId: '100101',
  menuName: '事发地址空项',
  menuList: [],
  xzqhList: null,
  startDate: null,
  endDate: null,
  dwlx: 'JJ',
  collapsed: false
}; // 默认 todolist 是空数组

// 数据处理器  useCallback 解决 useReducer 重复执行问题
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'INIT':
      return { ...state, ...payload }
    default:
      return state;
  }
};

export default reducer;