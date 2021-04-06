import {
    Home,
    Box,
    DollarSign,
    UserPlus,Archive, LogIn
} from 'react-feather';

export const MENUITEMS = [
    {
        path: '/dashboard', title: 'Dashboard', icon: Home, type: 'link', badgeType: 'primary', active: false
    },
    {
        title: 'Products', icon: Box, type: 'sub', active: false, children: [
            { path: '/products/customizes', title: 'Customizes', type: 'link' },
            { path: '/products/category', title: 'Category', type: 'link' },
            { path: '/products/product-list', title: 'Product List', type: 'link' },
            { path: '/products/add-product/0', title: 'Add Product', type: 'link' },
        ]
    },
    {
        title: 'Sales', icon: DollarSign, type: 'sub', active: false, children: [
            { path: '/sales/orders', title: 'Orders', type: 'link' },
            { path: '/sales/myorders', title: 'My Orders', type: 'link' },
        ]
    },
    {
        title: 'Users', icon: UserPlus, type: 'sub', active: false, children: [
            { path: '/users/list-user', title: 'User List', type: 'link' },
            { path: '/users/update-user', title: 'Update User', type: 'link' },
        ]
    }
]
