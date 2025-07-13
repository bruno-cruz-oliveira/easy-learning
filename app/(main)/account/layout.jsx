import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "./component/AccountMenu";
import { AccountSidebar } from "./component/AccountSidebar";

function Layout({ tabs }) {
	return (
		<section className="relative pb-16">
			{/*end container*/}
			<div className="container mx-auto relative mt-10">
				<div className="lg:flex">
					<AccountSidebar />
					<div className="lg:w-3/4 md:px-3 mt-[30px] lg:mt-0">
						{tabs}

					</div>
				</div>
				{/*end grid*/}
			</div>
			{/*end container*/}
		</section>
	);
}

export default Layout;