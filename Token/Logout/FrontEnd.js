//直接刪除本機儲存空間
const chooseWhoString = [0, 'Member', 'Store', 'Deliver', 'Admin']
localStorage.removeItem(chooseWhoString[whoLogin])