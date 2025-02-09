import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { addSpeciality, showSpecialities, updateSpeciality } from "@/api/admin";
import Loader from "@/components/Loader";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { set, useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
function Specializations() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["specializationList"],
    queryFn: showSpecialities, // Replace with the correct function to fetch patients
    retry: 3,
  });

  const { mutate: specialityMutate, isPending } = useMutation({
    mutationFn: updateSpeciality,
    onError: () => {
      console.log("Failed to update speciality");
      toast({
        title: "Failed to add speciality",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      console.log("Speciality added successfully");
      toast({
        title: "Speciality added successfully",
        variant: "default",
      });
    },
  });
  const { mutate: specialityAdd, isPending: isAddPending } = useMutation({
    mutationFn: addSpeciality,
    onError: () => {
      console.log("Failed to add speciality");
      toast({
        title: "Failed to add speciality",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      console.log("Speciality added successfully");
      toast({
        title: "Speciality added successfully",
        variant: "default",
      });
      window.location.reload();
    },
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  const [selectedSpeciality, setSelectedSpeciality] = useState({
    id: null,
    name: null,
    status: null,
  });
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error</div>;
  }
  console.log("data", data.data);
  // Sort function
  const sortedData = () => {
    if (!data || !data.data) return [];

    const sortedArray = [...data.data]; // Access the array under `data.data`
    if (sortConfig.key) {
      sortedArray.sort((a, b) => {
        const valueA = a[sortConfig.key] || a.user[sortConfig.key]; // Handle nested keys
        const valueB = b[sortConfig.key] || b.user[sortConfig.key];

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedArray;
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const finalData = sortedData();

  // Arrow Component
  const SortArrows = ({ columnKey }) => (
    <div className="inline-flex flex-col ml-1">
      <svg
        className={`w-3 h-3 ${
          sortConfig.key === columnKey && sortConfig.direction === "asc"
            ? "text-black"
            : "text-gray-400"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 12l5-5 5 5H5z" />
      </svg>
      <svg
        className={`w-3 h-3 ${
          sortConfig.key === columnKey && sortConfig.direction === "desc"
            ? "text-black"
            : "text-gray-400"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 8l5 5 5-5H5z" />
      </svg>
    </div>
  );
  const handleEdit = (speciality) => {
    console.log("Editing speciality", speciality);
    console.log(speciality.name);
    const updatedSpeciality = {
      id: speciality.id,
      name: speciality.name,
      status: speciality.status,
    };
    setSelectedSpeciality(updatedSpeciality);
    setValue("name", speciality.name); // Dynamically update the form field value
    console.log("selectedSpeciality", selectedSpeciality);
    setIsToggled(speciality.status === 1);

    setIsDialogOpen(true);
  };
  const onSubmit = (formData) => {
    const updatedSpeciality = {
      id: selectedSpeciality.id,
      name: formData.name,
      status: isToggled ? 1 : 0,
    };
    console.log("updatedSpeciality", updatedSpeciality);
    specialityMutate(updatedSpeciality);
    setIsDialogOpen(false);
  };

  const onAddSubmit = (formData) => {
    if (!formData.name) {
      console.error("Name is missing");
      toast({
        title: "Speciality name is required.",
        variant: "destructive",
      });
      return;
    }
    console.log("Submitted form data", formData);
    console.log(formData.name);
    specialityAdd({ name: formData.name });
    setIsAddDialogOpen(false);
  };

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  return (
    <div>
      {selectedSpeciality && isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Speciality</DialogTitle>
              <DialogDescription>
                {console.log("Current selectedSpeciality:", selectedSpeciality)}
                <form
                  className="flex  gap-2 justify-center items-center "
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <label>Speciality:</label>
                  <input
                    type="text"
                    className="outline-none border-black rounded-sm p-1 min-w-52"
                    defaultValue={selectedSpeciality.name}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                  )}
                  <label>Status:</label>
                  <input
                    type="hidden"
                    defaultValue={isToggled ? 1 : 0}
                    {...register("status")}
                  />
                  <input
                    type="checkbox"
                    checked={isToggled}
                    onChange={handleToggle}
                  />
                 
                  <p className="w-12">{isToggled ? "Active" : "Inactive"}</p>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Updating..." : "Submit"}
                  </Button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Speciality</DialogTitle>
            <DialogDescription>
              <form
                className="flex  gap-2 justify-center items-center"
                onSubmit={handleSubmit(onAddSubmit)}
              >
                <label>Speciality:</label>
                <input
                  type="text"
                  className="outline-none border-black rounded-sm p-1 w-full"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
                <Button type="submit" disabled={isAddPending}>
                  {isAddPending ? "Adding..." : "Add"}
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="text-2xl relative overflow-x-auto shadow-sm sm:rounded-s-sm mb-6 p-5 bg-white flex justify-between">
        <div>Specialities</div>
        <div
          className="text-sm font-bold text-blue-500 cursor-pointer hover:underline"
          onClick={() => handleAdd()}
        >
          Add new
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("id")}
              >
                ID
                <SortArrows columnKey="id" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name
                <SortArrows columnKey="name" />
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {finalData?.map((speciality) => (
              <tr key={speciality.id} className="bg-white border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {speciality.id}
                </th>
                <td className="px-6 py-4">{speciality.name}</td>
                <td className="px-6 py-4">
                  {speciality.status === 1 ? "Active" : "Inactive"}
                </td>

                <td className="px-6 py-4">
                  <FaEdit
                    className="text-green-500 cursor-pointer text-xl"
                    onClick={() => handleEdit(speciality)}
                  />

                  <MdDelete className="text-red-500 cursor-pointer text-xl" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Specializations;
