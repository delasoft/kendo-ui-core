(function() {
   var Grid = kendo.ui.Grid,
        div,
        data = [{ foo: "foo", bar: "bar", baz: "baz" }],
        DataSource = kendo.data.DataSource;

    module("grid column hiding", {
        setup: function() {
            div = $("<div></div>").appendTo(document.body);
        },
        teardown: function() {
            div.closest(".k-grid").remove();
        }
    });

    function setup(options) {
        options = $.extend(true, {}, {
            dataSource: {
                data: data
            },
            columns: [
                { field: "foo", width: 10 },
                { field: "bar", width: 20 },
                { field: "baz", width: 30 }
            ]
        },
        options);

        return new Grid(div, options);
    }

    test("hide cols for column in not scrollable grid", function() {
        var grid = setup({ scrollable: false });

        grid.hideColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("hide cols for column in scrollable grid", function() {
        var grid = setup();

        grid.hideColumn(0);

        var cols = grid.thead.prev().find("col");
        var tableCols = grid.table.find(">colgroup col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
        equal(tableCols.length, 2);
        equal(tableCols[0].style.width, "20px");
        equal(tableCols[1].style.width, "30px");
    });

    test("hide column by field name", function() {
        var grid = setup({ scrollable: false });

        grid.hideColumn("foo");

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("hide column header cells", function() {
        var grid = setup();

        grid.hideColumn(0);

        var ths = grid.thead.find("th");
        ok(!ths.eq(0).is(":visible"));
        ok(ths.eq(1).is(":visible"));
    });

    test("hide two column header cells", function() {
        var grid = setup();

        grid.hideColumn(0);
        grid.hideColumn(2);

        var ths = grid.thead.find("th");
        ok(!ths.eq(0).is(":visible"));
        ok(ths.eq(1).is(":visible"));
        ok(!ths.eq(2).is(":visible"));
    });

    test("hide column header cells in grid with details", function() {
        var grid = setup({ detailTemplate: "foo" });

        grid.hideColumn(0);

        var ths = grid.thead.find("th");
        ok(ths.eq(0).is(":visible"));
        ok(!ths.eq(1).is(":visible"));
        ok(ths.eq(2).is(":visible"));
        ok(ths.eq(3).is(":visible"));
    });

    test("hide column header cells in grouped grid", function() {
        var grid = setup({ dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);

        var ths = grid.thead.find("th");
        ok(ths.eq(0).is(":visible"));
        ok(!ths.eq(1).is(":visible"));
        ok(ths.eq(2).is(":visible"));
        ok(ths.eq(3).is(":visible"));
    });

    test("hide column cells", function() {
        var grid = setup();

        grid.hideColumn(0);

        var tds = grid.table.find("td");
        ok(!tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        ok(tds.eq(2).is(":visible"));
    });

    test("hiding already hidden column", function() {
        var grid = setup();

        grid.hideColumn(0);
        grid.hideColumn(0);

        var tds = grid.table.find("td");
        ok(!tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        ok(tds.eq(2).is(":visible"));
    });

    test("hidden columns remains hidden on refresh", function() {
        var grid = setup({ scrollable: false });

        grid.hideColumn(0);
        grid.refresh();

        var tds = grid.table.find("td");
        var ths = grid.thead.find("th");
        var cols = grid.thead.prev().find("col");
        ok(!tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        ok(tds.eq(2).is(":visible"));
        ok(!ths.eq(0).is(":visible"));
        ok(ths.eq(1).is(":visible"));
        ok(ths.eq(2).is(":visible"));
        equal(cols.length, 2);
        ok(grid.columns[0].hidden);
    });

    test("hide column cells in grid with details", function() {
        var grid = setup({ detailTemplate: "foo" });

        grid.hideColumn(0);

        var tds = grid.table.find("td");
        ok(tds.eq(0).is(":visible"));
        ok(!tds.eq(1).is(":visible"));
    });

    test("hiding column changes detail row colspan", function() {
        var grid = setup({ detailTemplate: "foo" });

        grid.expandRow(grid.items()[0]);
        grid.hideColumn(0);

        var tds = grid.table.find(".k-detail-row>td");
        ok(tds.eq(0).is(":visible"));
        ok(tds.eq(1).is(":visible"));
        equal(tds.eq(1).attr("colspan"), "2");
    });

    test("hide column cells in groupable grid", function() {
        var grid = setup({
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);

        var tds = grid.table.find("tr:nth(1)>td");
        ok(tds.eq(0).is(":visible"));
        ok(!tds.eq(1).is(":visible"));
    });

    test("hiding column changes grouping row cell colspan", function() {
        var grid = setup({
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.hideColumn(0);

        var td = grid.table.find("tr>td:first");
        ok(td.is(":visible"));
        equal(td.attr("colspan"), "3");
    });

    test("hide footer cells", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);

        var footer = grid.footer.find("td");
        ok(!footer.eq(0).is(":visible"));
        ok(footer.eq(1).is(":visible"));
        ok(footer.eq(2).is(":visible"));
    });

    test("hide footer cells in grid with groups and details", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo template"
            }],
            detailTemplate: "detail template",
            dataSource: {
                group: {
                    field: "foo"
                }
            }
        });

        grid.hideColumn(0);

        var footer = grid.footer.find("td");
        ok(footer.eq(0).is(":visible"));
        ok(footer.eq(1).is(":visible"));
        ok(!footer.eq(2).is(":visible"));
        ok(footer.eq(3).is(":visible"));
        ok(footer.eq(4).is(":visible"));
    });

    test("hide footer cols in scrollable grid", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);

        var cols = grid.footer.find("col");
        equal(cols.length, 2);
        equal(cols[0].style.width, "20px");
        equal(cols[1].style.width, "30px");
    });

    test("footer table width is persisted in scrollable grid", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);
        grid.refresh();

        var table = grid.footer.find("table");
        equal(table.width(), 50);

    });

    test("hide footer cols in scrollable grid with details and grouping", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }],
            detailTemplate: "detail template",
            dataSource: {
                group: {
                    field: "foo"
                }
            }
        });

        grid.hideColumn(0);

        var cols = grid.footer.find("col");
        equal(cols.length, 4);
        ok(cols.eq(0).hasClass("k-group-col"));
        ok(cols.eq(1).hasClass("k-hierarchy-col"));
        equal(cols[2].style.width, "20px");
        equal(cols[3].style.width, "30px");
    });

    test("hidden columns footer remains hidden on refresh", function() {
        var grid = setup({
            scrollable: false,
            columns: [{
                field: "foo",
                footerTemplate: "foo"
            }]
        });

        grid.hideColumn(0);
        grid.refresh();

        var footer = grid.footer.find("td");
        ok(!footer.eq(0).is(":visible"));
        ok(footer.eq(1).is(":visible"));
        ok(footer.eq(2).is(":visible"));
    });

    test("hiding column recalculates table width", function() {
        var grid = setup();

        grid.hideColumn(0);

        equal(grid.table.width(), 50);
    });

    test("hiding column does not change table width if column without width exist", function() {
        var grid = setup({
            columns: ["foo", { field: "bar" }, "baz"]
        }),
        width = grid.table.width();

        grid.hideColumn(0);

        equal(grid.table.width(), width);
    });

    test("showing column adds col element", function() {
        var grid = setup({
            scrollable: false,
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
    });

    test("showing column adds col element in scrollable grid", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var headerCols = grid.thead.prev().find("col");
        var cols = grid.tbody.prev().find("col");
        equal(headerCols .length, 3);
        equal(cols .length, 3);
        equal(cols[0].style.width, "10px");
        equal(cols[1].style.width, "20px");
        equal(cols[2].style.width, "30px");
    });

    test("showing column adds col element in grid with details", function() {
        var grid = setup({
            scrollable: false,
            detailTemplate: "foo",
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 4);
        ok(cols.eq(0).hasClass("k-hierarchy-col"));
        equal(cols[1].style.width, "10px");
        equal(cols[2].style.width, "20px");
        equal(cols[3].style.width, "30px");
    });

    test("showing column adds col element in grid with grouping", function() {
        var grid = setup({
            scrollable: false,
            dataSource: {
                group: { field: "foo" }
            },
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(0);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 4);
        ok(cols.eq(0).hasClass("k-group-col"));
        equal(cols[1].style.width, "10px");
        equal(cols[2].style.width, "20px");
        equal(cols[3].style.width, "30px");
    });

    test("showing column that doesn't exist", function() {
        var grid = setup({
            scrollable: false,
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn(-1);

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 2);
    });

    test("showing column by field name", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn("foo");

        var cols = grid.thead.prev().find("col");
        equal(cols.length, 3);
    });

    test("showing column displays header cells", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn("foo");
        var ths = grid.thead.find("th:visible");
        equal(ths.length, 3);
    });

    test("showing column displays header cells in grid with details", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            detailTemplate: "foo"
        });

        grid.showColumn("foo");
        var ths = grid.thead.find("th:visible");
        equal(ths.length, 4);
        ok(ths.eq(0).hasClass("k-hierarchy-cell"));
    });

    test("showing column displays header cells in grid with grouping", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.showColumn("foo");
        var ths = grid.thead.find("th:visible");
        equal(ths.length, 4);
        ok(ths.eq(0).hasClass("k-group-cell"));
    });

    test("showing column displays footer cells", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "foo" }]
        });

        grid.showColumn("foo");

        var tds = grid.footer.find("td:visible");
        equal(tds.length, 3);
    });

    test("showing column displays footer cells in grid with details and grouping", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "foo" }],
            detailTemplate: "details",
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.showColumn("foo");

        var tds = grid.footer.find("td:visible");
        equal(tds.length, 5);
        ok(tds.eq(0).hasClass("k-group-cell"));
        ok(tds.eq(1).hasClass("k-hierarchy-cell"));
    });

    test("showing column displays footer cols", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "foo" }]
        });

        grid.showColumn("foo");

        var cols = grid.footer.find("col");
        equal(cols.length, 3);
        equal(cols[0].style.width, "10px");
    });

    test("showing column displays data cells", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }]
        });

        grid.showColumn("foo");

        var tds = grid.tbody.find("td:visible");
        equal(tds.length, 3);
        equal(tds.eq(0).text(), "foo");
    });

    test("showing column displays data cells in grid with details", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            detailTemplate: "foo"
        });

        grid.showColumn("foo");

        var tds = grid.tbody.find("tr:first>td:visible");
        equal(tds.length, 4);
        ok(tds.eq(0).hasClass("k-hierarchy-cell"));
        equal(tds.eq(1).text(), "foo");
    });

    test("showing column changes detail row colspan", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            detailTemplate: "foo"
        });

        grid.expandRow(grid.tbody.children()[0]);
        grid.showColumn("foo");

        var td = grid.tbody.find(".k-detail-row .k-detail-cell");
        equal(td.attr("colspan"), "3");
    });

    test("showing column in grid with grouping", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true }],
            dataSource: {
                group: { field: "foo" }
            }
        });

        grid.showColumn("foo");

        equal(grid.table.find(".k-grouping-row>td").attr("colspan"), "4");
        equal(grid.tbody.children().eq(1).find("td:visible").length, 4);
    });

    test("showing column without specified width removes table width", function() {
        var grid = setup({
            columns: ["foo"]
        });
        var width = grid.table.css("width");

        grid.hideColumn("foo");
        grid.showColumn("foo");

        equal(grid.table.css("width"), width);
    });

    test("showing column with specified width changes table width", function() {
        var grid = setup();

        grid.hideColumn("bar");
        grid.showColumn("bar");

        equal(grid.table[0].style.width, "60px");
    });

    test("showing column with specified width in grid which has column width in percents", function() {
        var grid = setup({
            columns: [{ field: "foo", width: "10%" }]
        });

        grid.hideColumn("bar");
        var width = grid.table[0].style.width;
        grid.showColumn("bar");

        equal(grid.table[0].style.width, width);
    });

    test("showing column remains visible on refresh", function() {
        var grid = setup({
            columns: [{ field: "foo", hidden: true, footerTemplate: "template" }]
        });

        grid.showColumn("foo");
        grid.refresh();

        equal(grid.thead.prev().find("col").length, 3);
        equal(grid.thead.find("th:visible").length, 3);
        equal(grid.tbody.find("td:visible").length, 3);
        equal(grid.footer.find("td:visible").length, 3);
        equal(grid.columns[0].attributes.style, "");
    });

    test("showing column remove display style from attributes", function() {
        var grid = setup({
            columns: [{
                field: "foo",
                hidden: true,
                attributes: { style: "foo: bar" }
            }]
        });

        grid.showColumn("foo");
        var attr = grid.columns[0].attributes;

        ok(attr.style);
        equal(attr.style, "foo: bar");
    });

    test("hiding column triggers event", function() {
        var args,
            grid = setup({
                columnHide: function() {
                    args = arguments[0];
                }
            });

        grid.hideColumn("foo");

        ok(args);
        equal(args.column.field, "foo");
    });

    test("showing column triggers event", function() {
        var args,
            grid = setup({
                columns: [{
                    field: "foo",
                    hidden: true
                }],
                columnShow: function() {
                    args = arguments[0];
                }
            });

        grid.showColumn("foo");

        ok(args);
        equal(args.column.field, "foo");
    });

    test("hiding last consecutive columns", function() {
        var grid = setup();

        grid.hideColumn(1);
        grid.hideColumn(2);

        equal(grid.tbody.find("td:visible").length, 1, "visible column cells");
        equal(grid.tbody.find("td:not(:visible)").length, 2, "hidden column cells");
    });
})();
