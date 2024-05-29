// ?name=Ade&limit=10&page=2&sort=date&sort=-name&spaceUsed[gt]=50&select=name,type

class QueryBuilder {
  public queryBuild: any;
  public query: any;
  public paginationResult =  {};
  public countOfDocuments: number;

  constructor(query?: string, countOfDocuments?: number) {
    this.query = query || {};
    this.countOfDocuments = countOfDocuments
  }

  filter() {
    const filterObj = this.excludeFields(this.query, [ "sort","select","page","limit" ]);
    let where = this.normalizeMathOperatorsRecursive(filterObj);
    where = this.filterRecursive(where);
    const filtered = { where };
    this.queryBuild = { ...this.queryBuild, ...filtered };
    return this;
  }

  users(id:number) {
    const filterId = { id:{not:id} };
    this.queryBuild = { ...this.queryBuild, where:filterId };
    return this;
  }

  search() {
    const  {search, searchBy} = this.selectOnlyFields(this.query, ["search", "searchBy"]);
    if(search && searchBy){
      const searchData = search.split(",").map((item)=> ({[item]: {contains: searchBy, mode: "insensitive"}}))
      this.queryBuild = { ...this.queryBuild, where:{OR:searchData} };
      this.paginate();
    }
    
    return this;
  }

  sort() {
    const sort = this.selectOnlyFields(this.query, ["sort"]).sort || "-createdAt";
    const orderBy = sort.split(",").map((s: string) => ({
    [s.startsWith("-") ? s.slice(1, s.length) : s]: s.startsWith("-") ? "desc": "asc"}));
    this.queryBuild = { ...this.queryBuild, orderBy };
    return this;
  }

  select() {
    const selectFields = this.selectOnlyFields(this.query, ["select"]).select;
    const selections = this.getRecursiveSelection(selectFields);
    this.queryBuild = {...this.queryBuild,...selections};
    return this;
  }

  paginate() {
    let { page, limit, length } = this.selectOnlyFields(this.query, ["page","limit", "length"]);
    const usersLength = length? parseInt(length) : this.countOfDocuments;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = limit * (page - 1)
    const endIndex = page * limit;
    const numberOfPages = Math.ceil(usersLength / limit);
    let next = 0;
    let prev = 0;
    if (endIndex < usersLength) next = page + 1;
    if (skip > 0)  prev = page - 1;
    this.paginationResult = {page, limit, numberOfPages, next, prev};
    this.queryBuild = {...this.queryBuild, skip, take: limit};
    return this;
  }

  private excludeFields(o: Record<string, unknown>, ex: string[]) {
    const e = { ...o };
    for (const t in e) {
      if (ex.includes(t)) delete e[t];
    }
    return e;
  }

  private selectOnlyFields(o: Record<string, unknown>, ex: string[]) {
    const e: any = {};
    ex.forEach((i) => (e[i] = o[i]));
    return e;
  }

  private normalizeMathOperatorsRecursive(filters: any) {
    if (!filters || Object.keys(filters).length < 1) return {};
    let normalized = {};
    for (const key in filters) {
      const value = filters[key];
      if (typeof value !== "string")normalized = {
        ...normalized,[key]: this.normalizeMathOperatorsRecursive(value)};
      else if (!isNaN(value as any))normalized = { ...normalized, [key]: parseInt(value) };
      else normalized = { ...normalized, [key]: value };
    }
    return normalized;
  }

  private filterRecursive(filters: any) {
    if (!filters || Object.keys(filters).length < 1) return {};
    let normalized = {};
    for (const key in filters) {
      const value = filters[key];
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        normalized = {...normalized,[parent]: { [child]: value }};
      } else normalized = { ...normalized, [key]: value }; 
    }
    return normalized;
  }

  private getRecursiveSelection(selectClause: string): Record<string, unknown> {
    if (!selectClause) return {};
    if (selectClause.includes(",")) {
      let r = {};
      const s = selectClause.split(",");
      for (const i of s) {r = { ...r, ...this.getRecursiveSelection(i)}}
      return { select: r };
    }

    if (selectClause.includes(".")) {
      const [c, ...rest] = selectClause.split(".");
      const rj = rest.join();
      const sd = rj.slice(1, rj.length - 1);
      return {[c]: { ...this.getRecursiveSelection(sd) }};
    }

    if (selectClause.includes("|")) {
      let r = {};
      const s = selectClause.split("|");
      for (const i of s) {r = { ...r, ...this.getRecursiveSelection(i)}}
      return { select: r };
    }
    return {
      [selectClause]: true,
    };
  }
}

export default QueryBuilder;
