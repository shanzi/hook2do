# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0002_timelogentry'),
        ('connector', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResourceIdMapping',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('resource_id', models.CharField(max_length=32)),
                ('owner', models.ForeignKey(to='connector.ResourceChannel')),
                ('todoItem', models.ForeignKey(to='todos.ToDoItem')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
