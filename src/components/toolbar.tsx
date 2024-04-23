import { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button"
import { DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter, DrawerContent, Drawer } from "@/components/ui/drawer"
import Form from "@/components/form";
import Image from "next/image";
import { ComingSoon } from './ui/comingsoon';


export default function Toolbar({ loadData }: {loadData: () => void}) {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const closeDrawer = useCallback(() => {
      setDrawerOpen(false);
      loadData();
    }, [loadData]);

    return (
        <div className="bg-white sticky bottom-0 border-t p-4 flex items-center justify-center space-x-8 backdrop-blur-lg mx-auto w-48 md:w-44 h-fit rounded-full border border-input fixed bottom-[18px] left-0 right-0">
          {/* <Button size="lg" variant="ghost"> */}
            <Image
                alt="Home"
                className="rounded-lg cursor-pointer"
                height="32"
                src='/home.png'
                // style={{
                //     aspectRatio: "48/48",
                //     objectFit: "cover",
                // }}
                width="32"
            />
          {/* </Button> */}
          {/* <Button size="lg" variant="ghost">
            Settings
          </Button> */}
          <ComingSoon>
            <Image
                  alt="Home"
                  className="rounded-lg cursor-pointer"
                  height="32"
                  src='/setting.png'
                  // style={{
                  //     aspectRatio: "48/48",
                  //     objectFit: "cover",
                  // }}
                  width="32"
              />
          </ComingSoon>
          <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              {/* <Button size="lg" variant="ghost">
                Add a New Subscription
              </Button> */}
              <Image
                alt="Home"
                className="rounded-lg cursor-pointer"
                height="32"
                src='/add.png'
                // style={{
                //     aspectRatio: "48/48",
                //     objectFit: "cover",
                // }}
                width="32"
            />
            </DrawerTrigger>
            <DrawerContent>
              <Form closeDrawer={closeDrawer} />
            </DrawerContent>
        </Drawer>
      </div>
    )
}