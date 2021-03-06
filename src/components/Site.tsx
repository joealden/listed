import React from "react";
import memoize from "memoize-one";
import MediaQuery from "react-responsive";

import {
  Post,
  FilterSortBy,
  InfoType,
  FilterType,
  FilterLineTransition
} from "../utils/types";

import disableScrolling from "../utils/disableScrolling";

import MobileSite from "./mobile/Site";
import DesktopSite from "./desktop/Site";
import GlobalStyles from "./GlobalStyles";

import sortPosts from "../utils/sortPosts";
import filterPosts from "../utils/filterPosts";

const memoizedSortPosts = memoize(sortPosts);
const memoizedFilterPosts = memoize(filterPosts);

const dummyPost: Post = {
  id: "",
  title: "",
  link: "",
  category: "",
  tags: [""],
  createdAt: "",
  image: {
    fluid: {
      base64: "",
      aspectRatio: 1,
      src: "",
      srcSet: "",
      sizes: ""
    }
  }
};

type SiteProps = {
  toggleTheme: () => void;
  posts: Array<Post>;
  categories: Array<string>;
  tags: Array<string>;
};

type SiteState = {
  info: InfoType;
  filter: FilterType;
  aboutOpen: boolean;
  filterLineTransition: FilterLineTransition;
};

class Site extends React.Component<SiteProps, SiteState> {
  state: Readonly<SiteState> = {
    info: {
      open: false,
      post: dummyPost
    },
    filter: {
      open: false,
      sortBy: FilterSortBy.NewestFirst,
      selectedCategory: null,
      selectedTags: []
    },
    aboutOpen: false,
    filterLineTransition: FilterLineTransition.Initial
  };

  /* ----------------- Info ----------------- */

  openInfo = (post: Post) => {
    disableScrolling.on();
    this.setState({
      info: {
        open: true,
        post
      }
    });
  };

  closeInfo = () => {
    disableScrolling.off();
    this.setState(prevState => ({
      info: {
        ...prevState.info,
        open: false
      }
    }));
  };

  /* ---------------- Filter ---------------- */

  openFilter = () => {
    disableScrolling.on();
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        open: true
      }
    }));
  };

  closeFilter = () => {
    disableScrolling.off();
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        open: false
      }
    }));
  };

  setFilterSortBy = (sortBy: FilterSortBy) =>
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        sortBy
      }
    }));

  setSelectedCategory = (selectedCategory: string) =>
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        selectedCategory
      }
    }));

  addTagToSelectedTags = (tagToAdd: string) => {
    const { filter } = this.state;
    const { selectedTags } = filter;

    if (!selectedTags.includes(tagToAdd)) {
      this.setState(prevState => ({
        filter: {
          ...prevState.filter,
          selectedTags: [...selectedTags, tagToAdd]
        }
      }));
    }
  };

  removeTagFromSelectedTags = (tagToRemove: string) => {
    const { filter } = this.state;
    const { selectedTags } = filter;

    const selectedTagsWithoutTagToRemove = selectedTags.filter(
      tag => tag !== tagToRemove
    );

    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        selectedTags: selectedTagsWithoutTagToRemove
      }
    }));
  };

  clearSelectedTags = () =>
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        selectedTags: []
      }
    }));

  /* ----------------- About ---------------- */

  openAbout = () => {
    disableScrolling.on();
    this.setState({ aboutOpen: true });
  };

  closeAbout = () => {
    disableScrolling.off();
    this.setState({ aboutOpen: false });
  };

  /* -------- Filter Line Transition -------- */

  setFilterLineTransition = (filterLineTransition: FilterLineTransition) => {
    this.setState({ filterLineTransition });
  };

  /* ---------------------------------------- */

  render() {
    const {
      openInfo,
      closeInfo,
      openFilter,
      closeFilter,
      setFilterSortBy,
      setSelectedCategory,
      addTagToSelectedTags,
      removeTagFromSelectedTags,
      clearSelectedTags,
      openAbout,
      closeAbout,
      setFilterLineTransition
    } = this;

    const { toggleTheme, posts, categories, tags } = this.props;
    const { info, filter, aboutOpen, filterLineTransition } = this.state;

    const filteredPosts = memoizedFilterPosts(
      posts,
      filter.selectedCategory,
      filter.selectedTags
    );

    const sortedPosts = memoizedSortPosts(filteredPosts, filter.sortBy);

    return (
      <>
        <MediaQuery maxWidth={1023}>
          <MobileSite
            toggleTheme={toggleTheme}
            posts={sortedPosts}
            categories={categories}
            setSelectedCategory={setSelectedCategory}
            tags={tags}
            addTagToSelectedTags={addTagToSelectedTags}
            removeTagFromSelectedTags={removeTagFromSelectedTags}
            clearSelectedTags={clearSelectedTags}
            openInfo={openInfo}
            closeInfo={closeInfo}
            openFilter={openFilter}
            closeFilter={closeFilter}
            setFilterSortBy={setFilterSortBy}
            openAbout={openAbout}
            closeAbout={closeAbout}
            info={info}
            filter={filter}
            aboutOpen={aboutOpen}
            filterLineTransition={filterLineTransition}
            setFilterLineTransition={setFilterLineTransition}
          />
        </MediaQuery>
        <MediaQuery minWidth={1024}>
          <DesktopSite
            toggleTheme={toggleTheme}
            posts={sortedPosts}
            categories={categories}
            setSelectedCategory={setSelectedCategory}
            tags={tags}
            addTagToSelectedTags={addTagToSelectedTags}
            removeTagFromSelectedTags={removeTagFromSelectedTags}
            clearSelectedTags={clearSelectedTags}
            openInfo={openInfo}
            closeInfo={closeInfo}
            openFilter={openFilter}
            closeFilter={closeFilter}
            setFilterSortBy={setFilterSortBy}
            openAbout={openAbout}
            closeAbout={closeAbout}
            info={info}
            filter={filter}
            aboutOpen={aboutOpen}
            filterLineTransition={filterLineTransition}
            setFilterLineTransition={setFilterLineTransition}
          />
        </MediaQuery>
        <GlobalStyles />
      </>
    );
  }
}

export default Site;
