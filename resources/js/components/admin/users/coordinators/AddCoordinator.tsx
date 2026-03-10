import { AcademicRanksOptions, UnitOptions } from "../../../../constant/UserDropOptionsData";
import useAddUsers from "../../../../hooks/useAddUsers";

const AddCoordinator = () => {
  const { errormsg, fileUpload, handleChange, handleSubmit, loading, user } =
    useAddUsers("/api/coordinators", "/manage-coordinators");

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-[70%] rounded-lg bg-white p-10 shadow-custom"
      >
        <h1 className="mb-10 font-bold">Add Coordinator</h1>

        <div className="flex w-full flex-1 justify-between">
          <div className="w-[45%]">
            <label
              htmlFor="firstName"
              className="mb-2 block font-bold text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="fname"
              value={user.fname}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="p-2 text-sm text-red-700">{errormsg.fname}</p>
          </div>

          <div className="w-[45%]">
            <label
              htmlFor="lastName"
              className="mb-2 block font-bold text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lname"
              value={user.lname}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="p-2 text-sm text-red-700">{errormsg.lname}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <div className="mt-4">
            <label
              htmlFor="middleInitial"
              className="mb-2 block font-bold text-gray-700"
            >
              Middle Initial
            </label>
            <input
              type="text"
              id="middleInitial"
              name="mi"
              value={user.mi}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <p className="p-2 text-sm text-red-700">{errormsg.mi}</p>
          </div>

          <div className="mt-4">
            <label
              htmlFor="suffix"
              className="mb-2 block font-bold text-gray-700"
            >
              Suffix
            </label>
            <input
              type="text"
              id="suffix"
              name="suffix"
              value={user.suffix}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="image"
              className="mb-2 block font-bold text-gray-700"
            >
              Image Profile
            </label>
            <input
              type="file"
              id="image"
              name="image_path"
              onChange={fileUpload}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <label
          htmlFor="department"
          className="mb-2 block font-bold text-gray-700"
        >
          Department
        </label>
        <select
          id="department"
          name="college"
          value={user.college}
          onChange={handleChange}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option defaultValue="Select Department">Select Department</option>
          <option value="CAS">CAS</option>
          <option value="CME">CME</option>
          <option value="COE">COE</option>
        </select>
        <p className="p-2 text-sm text-red-700">{errormsg.college}</p>

        <div className="mt-4">
          <label htmlFor="unit" className="mb-2 block font-bold text-gray-700">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            value={user.unit}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option defaultValue="Select a unit">Select a unit</option>
            {UnitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <p className="p-2 text-sm text-red-700">{errormsg.unit}</p>
        </div>

        <div className="mt-4">
          <label
            htmlFor="academicRank"
            className="mb-2 block font-bold text-gray-700"
          >
            Academic Rank
          </label>
          <select
            id="academicRank"
            name="academic_rank"
            value={user.academic_rank}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option defaultValue="Select an academic rank">
              Select an academic rank
            </option>
            {AcademicRanksOptions.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
          <p className="p-2 text-sm text-red-700">{errormsg.academic_rank}</p>
        </div>

        <div className="mt-4">
          <label htmlFor="email" className="mb-2 block font-bold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="p-2 text-sm text-red-700">{errormsg.email}</p>
        </div>

        <div className="mt-4">
          <label
            htmlFor="password"
            className="mb-2 block font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="p-2 text-sm text-red-700">{errormsg.password}</p>
        </div>
        <div className="mt-6">
          {!loading ? (
            <button
              type="submit"
              className="w-full rounded-md bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-600"
            >
              Register
            </button>
          ) : (
            <button
              type="submit"
              disabled
              className="align-items-center w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white"
            >
              Registering...
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCoordinator;
