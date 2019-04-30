/*
 * Schedule plugin for CraftCMS 3
 *
 * @link      https://panlatent.com/
 * @copyright Copyright (c) 2019 panlatent@gmail.com
 */

(function () {
    const LogList = {
        template: '<div>' +
            '<el-table v-loading="loading" :data="tableData" style="width: 100%">\n' +
            '    <el-table-column type="index" :index="indexMethod"> </el-table-column>\n' +
            '    <el-table-column prop="status" :label="translations.Status" width="180">\n' +
            '        <template slot-scope="props">\n' +
            '            <el-tag type="success" size="medium" v-if="props.row.status == \'successful\'">{{ props.row.status }}</el-tag>\n' +
            '         <template slot-scope="props" v-else-if="props.row.status == \'failed\'">\n' +
            '             <el-popover\n' +
            '              placement="top-start"\n' +
            '              width="200"\n' +
            '              trigger="hover"\n' +
            '              :title="translations.Reason"\n' +
            '              :content="props.row.reason">\n' +
            '                  <el-tag type="danger" size="medium" slot="reference">{{ props.row.status }}</el-tag>\n' +
            '              </el-popover>' +
            '        </template>\n' +
            '        <el-tag type="info" size="medium" v-else>{{ props.row.status }}</el-tag>\n' +
            '        </template>\n' +
            '     </el-table-column>\n' +
            '     <el-table-column prop="startTime" :label="translations[\'Start Date\']" width="200"></el-table-column>\n' +
            '     <el-table-column prop="endTime" :label="translations[\'End Date\']" width="200"></el-table-column>\n' +
            '     <el-table-column :label="translations.Duration">\n' +
            '         <template slot-scope="props">\n' +
            '            {{ props.row.duration }} ms\n' +
            '         </template>\n' +
            '     </el-table-column>\n' +
            '     <el-table-column prop="output" :label="translations.Output" type="expand">\n' +
            '        <template slot-scope="props">\n' +
            '            <el-form label-position="left" inline class="demo-table-expand">\n' +
            '              <div style="background-color: black;">{{ props.row.output }}</div>\n' +
            '            </el-form>\n' +
            '        </template>\n' +
            '    </el-table-column>\n' +
            '</el-table>\n' +
            '<el-pagination style="margin-top: 10px;" ' +
            '    @size-change="handleSizeChange"\n' +
            '    @current-change="handleCurrentChange"\n' +
            '    :current-page="currentPage"\n' +
            '    :page-sizes="[20, 50, 100, 500]"\n' +
            '    :page-size="pageSize"\n' +
            '    layout="total, sizes, prev, pager, next, jumper"\n' +
            '    :total="total">>' +
            '</el-pagination>' +
            '</div>',
        data() {
            return {
                loading: true,
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 20,
                translations: window.Craft.translations.schedule,
            }
        },
        mounted: function () {
            this.getLogs()
        },
        created() {
            this.getLogs()
        },
        watch: {
            '$route': 'getLogs'
        },
        methods: {
            indexMethod(index) {
                return this.tableData[index].sortOrder
            },
            getLogs: function () {
                var vm = this;

                this.loading = true
                this.tableData = []

                this.$http.post(api.logsUrl, {
                    criteria: {
                        schedule: vm.$route.params['handle'],
                        offset: (vm.currentPage - 1) * vm.pageSize,
                        limit: vm.pageSize,
                    }
                }).then(response => {
                    vm.loading = false
                    vm.total = response.data.total
                    vm.tableData = response.data.data
                })
            },
            handleSizeChange: function(val) {
                this.pageSize = val
                this.getLogs()
            },
            handleCurrentChange: function(val) {
                this.currentPage = val
                this.getLogs()
            },
        }
    }

    const router = new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/admin/schedule/logs/:handle',
                name: 'logs',
                component: LogList
            }
        ]
    })

    Vue.use(ELEMENT)

    if (typeof(language) !== "undefined") {
        ELEMENT.locale(ELEMENT.lang[language])
    }

    new Vue({
        el: '#logs',
        router,
        data() {
            return {
                schedules: [],
                search: '',
                loading: true
            }
        },
        watch: {
            search: function () {
                this.getSchedules()
            }
        },
        mounted: function () {
            this.getSchedules()
        },
        methods: {
            getSchedules: function () {
                var vm = this;
                this.$http.post(api.schedulesUrl, {
                    criteria: {
                        search: vm.search
                    }
                }).then(response => {
                    vm.loading = false
                    vm.schedules = response.data.data
                })
            }
        }
    })
})()