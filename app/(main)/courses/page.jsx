"use client";
import { SearchCourse } from "./_components/SearchCourse";
import { SortCourse } from "./_components/SortCourse";
import { FilterCourseMobile } from "./_components/FilterCourseMobile";
import { ActiveFilters } from "./_components/ActiveFilters";

// for mobile sidebar
import { FilterCourse } from "./_components/FilterCourse";
import CourseCard from "./_components/CourseCard";
import { useEffect, useState } from "react";
import { getSlug } from '@/lib/convertData';

const filtersObj = {
  categories: [],
  price: ["paid"],
  sort: "",
}

const priceOptions = [
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

const categoryOptions = [];

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(filtersObj);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        data.forEach(category => {
          let title = getSlug(category.title);
          title = title.replace('0', '-');

          categoryOptions.push({
            id: category.id,
            label: category.title,
            value: title
          })
        });
      } catch (error) {
        throw new Error(error);
      }
    }

    async function fetchCourses() {
      const queryParams = new URLSearchParams();
      console.log(filters);
      queryParams.append('sort', 1);

      if (search) {
        queryParams.append('search', search);
      }
      
      if (filters.categories.length != 0) {
        const filter = filters.categories.map((category) => {
          let id;

          for (const categoryOption of categoryOptions) {
            if(category == categoryOption.value) {
              id = categoryOption.id;
              break;
            }
          }

          return id;
        })

        queryParams.append('filters', filter.join('_'));
      }

      if(filters.price.length != 0) {
        queryParams.append('price', filters.price[0]);
      }

      const queryString = queryParams.toString();
      const url = `/api/courses${queryString ? `?${queryString}` : ''}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setCourses(data);
      } catch (error) {
        throw new Error(error);
      }
    }

    if(categoryOptions.length === 0) {
      fetchCategories()
    }

    const debounceTimeout = setTimeout(() => {
      if (search || filters) {
        fetchCourses();
      } else {
        setCourses([]);
      }
    }, 1000);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [search, filters]);

  const handleChangeSearch = (event) => {
    setSearch(event.target.value);
  };

  const applyFilter = ({ type, value }) => {
    const isFilterApplied = filters[type].includes(value);

    if (isFilterApplied) {
      setFilters((prev) => ({
        ...prev,
        [type]: prev[type].filter((v) => v !== value),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [type]: [...prev[type], value],
      }));
    }
    setSearch('');
  };

  return (
    <section
      id="courses"
      className="container mx-auto space-y-6 dark:bg-transparent py-6"
    >
      <div className="flex items-baseline justify-between  border-gray-200 border-b pb-6 flex-col gap-4 lg:flex-row">
        <SearchCourse search={search} handleChange={handleChangeSearch} />
        <div className="flex items-center justify-end gap-2 max-lg:w-full">
          <SortCourse />
          <FilterCourseMobile filter={filters} applyFilter={applyFilter} categoryOptions={categoryOptions} priceOptions={priceOptions} />
        </div>
      </div>
      <ActiveFilters
        applyFilter={applyFilter}
        filter={filters}
      />
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          {/* these component can be re use for mobile also */}
          <FilterCourse filter={filters} applyFilter={applyFilter} categoryOptions={categoryOptions} priceOptions={priceOptions} />
          {/* Course grid */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {courses.map((course) => {
              return (
                <CourseCard key={course.id} course={course} />
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
};
export default CoursesPage;
