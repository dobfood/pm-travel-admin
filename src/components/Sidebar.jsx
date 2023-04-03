import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutLined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  NotificationsOutlined,
  AdminPanelSettingsOutlined,
  LuggageOutlined
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import profileImage from "assets/z3887572277545_175ce1a7a3f44f9c912c8e91b507c24c (1).jpg";
const navItems=[
     {text:"Dashboard",
icon:<HomeOutlined/>},
{text:"Người dùng",
icon:null},
{text:"Tour",
icon:<LuggageOutlined/>},
{text:"Khách hàng",
icon:<Groups2Outlined/>},
{text:"Hóa đơn",
icon:<ReceiptLongOutlined/>},
{text:"Đặt tour",
icon:<HomeOutlined/>},
{text:"Thông báo",
icon:<NotificationsOutlined/>},
{text:"Thống kê",
icon:null},
{text:"Tổng quan",
icon:<PointOfSaleOutlined/>},
{text:"Hằng ngày",
icon:<TodayOutlined/>},
{text:"Hằng tháng",
icon:<CalendarMonthOutlined/>},
{text:"Biểu đồ tròn",
icon:<PieChartOutlined/>},
{text:"Quản lý",
icon:null},
{text:"Quản trị viên",
icon:<AdminPanelSettingsOutlined/>},
{text:"Hiệu suất",
icon:<TrendingUpOutlined/>},
]

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
    const {pathname} = useLocation()
    const [active,setActive] = useState("")
    const navigate = useNavigate()
    const theme = useTheme()
    useEffect(()=>{
        setActive(pathname.substring(1))
    },[pathname])
  return <Box component="nav">
    {isSidebarOpen && (
        <Drawer open={isSidebarOpen}
        close={()=>setIsSidebarOpen(false)}
        variant="persistent"
        anchor = "left"
        sx={{
            width:drawerWidth,
            "& .MuiDrawer-paper":{
                color:theme.palette.secondary[200],
                backgroundColor:theme.palette.background.alt,
                boxSiXing:"border-box",
                borderWidth:isNonMobile ? 0 :"2px",
                width:drawerWidth
            }
        }}
        >
<Box width="100%">
    <Box m="1.5rem 2rem 2rem 3rem">
        <FlexBetween color ={theme.palette.secondary.main}>
            <Box display="flex" alightItems="center" gap="0.5rem">
        <Typography varian="h4" fontWeight="bold">
            PM-TRAVEL
        </Typography>
            </Box>
            {!isNonMobile && (<IconButton onClick={()=>setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft/>
            </IconButton>
            )}
        </FlexBetween>
    </Box>
    <List>
        {navItems.map(({text,icon})=>{
            if(!icon){
                return (
                    <Typography key={text} sx={{ m :"2.25rem 0 1rem 3rem"}}>
                        {text}
                    </Typography>
                )
            }
            const lcText = text.toLowerCase();
            return (
                <ListItem key = {text} disablePadding >
                    <ListItemButton onClick={()=>{navigate(`/${lcText}`);
                    setActive(lcText)

                }}
                    sx={{backgroundColor:active === lcText ? theme.palette.secondary[300]: "transparent",
                    color:active === lcText ? theme.palette.primary[600] :theme.palette.secondary[100] }}
                >
                    <ListItemIcon sx={{
                        ml:"2rem",
                        color:active === lcText ? theme.palette.primary[600] :theme.palette.secondary[200] }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary = {text}/>
                        {active === lcText &&(<ChevronRightOutlined sx={{ml:"auto"}}/>)}
                    </ListItemButton>
                </ListItem>
            )
        })}
    </List>
</Box>
        </Drawer>
    )}
  </Box>;
};

export default Sidebar;
