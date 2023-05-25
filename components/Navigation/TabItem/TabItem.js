import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import DrawerItem from "../DrawerItem/DrawerItem";
import {useDispatch} from "react-redux";
import {selectPage} from "../../../redux/actions";
import { useRouter } from 'next/router'

const TabItem = (props) => {
    
    const dispatch = useDispatch();
    const router = useRouter()
    const pathname = router.pathname
    const {path} = router.query;
    console.log("tabitem ", path)
    if (!props.tabItems || props.tabItems.length === 0)
        return null;
    return (
           <>
            {pathname}
            {
            props.tabItems.map((item, index) => {
                console.log("index ", index)
                console.log("item ", item)
                
            })
            }
           </>
            /* props.tabItems.map((item, index) => {
                return (
                    <Route
                        key={index}
                        path={"/app/" + item.path + "/:url?"}
                        render={
                            () => {
                                dispatch(selectPage(index));
                                return (
                                    (item.path === "tools") ?
                                        <DrawerItem drawerItems={props.drawerItems}/>
                                        :
                                        <Container key={index}>
                                            <Fade in={true}>
                                                <div>
                                                    {props.tabItems[index].content}
                                                    {props.tabItems[index].footer}
                                                </div>
                                            </Fade>
                                        </Container>
                                )
                            }
                        }
                    />
                );
            })*/
            
       
    );
};
export default TabItem;