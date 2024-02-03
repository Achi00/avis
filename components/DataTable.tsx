"use client";
import { getUsers } from "@/utils";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Cards from "./Cards";

interface User {
  id: number;
  name: string;
  division: string;
  location: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name", // Accessor matches the property of your user data
    header: () => <span>Name</span>,
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "division",
    header: () => <span>Division</span>,
    cell: ({ row }) => <span>{row.getValue("division")}</span>,
  },
  {
    accessorKey: "location",
    header: () => <span>Location</span>,
    cell: ({ row }) => <span>{row.getValue("location")}</span>,
  },
  // ... Add more columns as needed
];

const DataTable = () => {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // after customer selects row
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showCards, setShowCards] = useState(false);
  // show thank you screen after customer selects value
  const [showThankYou, setShowThankYou] = useState(false);

  // fetch data
  useEffect(() => {
    // Directly fetch data from the API endpoint
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data); // Update the users state with fetched data
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of the outcome
      }
    };

    fetchUsers();
  }, []); // Dependency array is empty, so this runs once on mount

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // search based on name
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setColumnFilters([{ id: "name", value }]);
  };
  // customer clicks row
  const handleRowClick = (userId: number) => {
    console.log(`Row clicked with userId: ${userId}`); // Debugging line
    setSelectedUserId(userId);
    setShowCards(true);
  };

  // This function will be called when a card is selected in the Cards component
  const handleCardSelect = async (userId: number, value: string) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the client-side state if necessary
      // For example, update the user's interest in the `data` state array
      const updatedUsers = data.map((user) =>
        user.id === userId ? { ...user, value } : user
      );
      setData(updatedUsers);

      console.log("Interest updated successfully");
      // Here you would hide the Cards component and show a success message
    } catch (error) {
      console.error("Error updating interest:", error);
    }
    console.log(`Card selected with userId: ${userId}, value: ${value}`);
    setShowCards(false); // Hide the cards component
    setShowThankYou(true); // Show the thank you message
    // Here you would normally call updateUserChoiceInDatabase or similar
    // to persist the user's choice to the database.
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center">
        <div className="p-5 w-1/2">
          <Input
            placeholder="Search..."
            onChange={handleSearchChange}
            className="mb-4"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-[#D4002A] text-lg cursor-pointer border-b border-gray-500"
              onClick={() => handleRowClick(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showCards && selectedUserId != null && (
        <div className="absolute top-0 w-full h-screen">
          <Cards userId={selectedUserId} onSelect={handleCardSelect} />
        </div>
      )}
      <div className="absolute w-full">
        {showThankYou && (
          <div className="fixed w-full inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 md:p-16 lg:p-24 text-center w-full h-full flex justify-center items-center flex-col">
              <h3 className="text-2xl md:text-4xl font-semibold">Thank You!</h3>
              <button
                className="mt-8 bg-blue-500 text-white text-sm md:text-base px-5 py-2 rounded hover:bg-blue-700 transition-colors focus:outline-none"
                onClick={() => setShowThankYou(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
