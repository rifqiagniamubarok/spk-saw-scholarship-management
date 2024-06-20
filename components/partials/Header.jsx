import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from '@nextui-org/react';
import Link from 'next/link';
import { IoIosLogOut } from 'react-icons/io';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pageList = [
    {
      name: 'Dashboard',
      path: '/dashboard',
    },
    {
      name: 'Kriteria',
      path: '/criteria',
    },
    {
      name: 'Permintaan',
      path: '/request',
    },
    {
      name: 'Hasil',
      path: '/result',
    },
  ];

  const handleLogout = () => {
    deleteCookie('token');
    localStorage.clear();
    router.push('/admin/login');
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="text-white bg-primary">
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
        <NavbarBrand>
          <p className="font-bold text-inherit">Beasiswa Management</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {pageList.map((page, index) => {
          return (
            <NavbarItem key={index}>
              <div className="flex items-center gap-4">
                <Link href={`/admin/${page.path}`}>
                  <p className="text-white">{page.name}</p>
                </Link>
                {index + 1 != pageList.length && <div className="h-5 w-[1px] bg-gray-200 rounded-md"></div>}
              </div>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden md:flex ">
          <Button color="danger" onClick={handleLogout}>
            Keluar
            <IoIosLogOut />
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="text-white bg-primary opacity-90 ">
        {pageList.map((item, index) => (
          <NavbarMenuItem key={`${index}`}>
            <Link href={`/admin/${item.path}`}>{item.name}</Link>
          </NavbarMenuItem>
        ))}
        <div>
          <Button color="danger" onClick={handleLogout}>
            Keluar
            <IoIosLogOut />
          </Button>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
